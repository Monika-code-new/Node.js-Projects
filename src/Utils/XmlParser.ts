
import { parseStringPromise } from 'xml2js';

type Metadata = Record<string, any>;
type ParsedProperty = Record<string, any>;

function getXmlNodeText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node._ === 'string') return node._;
  return String(node);
}

function fromCamelCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

function formatNotes(value?: string): string {
  if (!value) return '';
  return value.trim();
}

/**
 * Normalize any xml2js node to an array
 */
function normalizeToArray(node: any): any[] {
  if (!node) return [];
  return Array.isArray(node) ? node : [node];
}


export function parseRoomTypes(roomTypesNode: any): any[] {
  let roomTypes = normalizeToArray(roomTypesNode?.[0]?.RoomType ?? roomTypesNode?.RoomType);

  const result: any[] = [];

  for (const roomType of roomTypes) {
    const data: any = {};
    data.metadata = {} as Metadata;

    for (const key of Object.keys(roomType)) {
      const rawValue = roomType[key]?.[0];
      let localKey = fromCamelCase(key);
      let localValue: any = null;
      let ignored = false;

      switch (key) {
        /* ---------- ignored ---------- */
        case 'SpecialOfferApplied':
        case 'DiscountID':
        case 'Saving':
        case 'PayLocalTotal':
        case 'TotalCommission':
        case 'DailyRates':
        case 'RegionalTax':
        case 'RoomViewID':
        case 'Taxes':
        case 'InvalidFlightResults':
        case 'Cancellations':
        case 'SupplierID':
        case 'RoomDescription':
        case 'Description':
          ignored = true;
          break;

        /* ---------- integers ---------- */
        case 'MealBasisGroupID':
        case 'Discount':
        case 'SubTotal':
        case 'Total':
        case 'RoomTypeID':
        case 'MealBasisID':
          localValue = Number(getXmlNodeText(rawValue));
          break;

        /* ---------- metadata text ---------- */
        case 'Adults':
        case 'Children':
        case 'Infants':
        case 'AvailableRooms':
        case 'Source':
        case 'MealBasis':
        case 'RoomType':
        case 'RoomView':
        case 'MealBasisCustomerNotes':
        case 'TPReference':
          ignored = true;
          data.metadata[localKey] = formatNotes(getXmlNodeText(rawValue));
          break;

        /* ---------- special offer ---------- */
        case 'SpecialOffer':
          ignored = true;
          let offerValue = getXmlNodeText(rawValue);
          if (roomType?.Source?.[0] === 'AlphaTours') {
            const match = offerValue.match(/(\d+)% discount/i);
            if (match) offerValue = `${match[1]}% saving`;
          }
          offerValue = offerValue
            .replace(/(General Offers\.?)+/gi, '')
            .replace(/^\s*Includes\s*/i, '');
          data.metadata[localKey] = offerValue;
          break;

        /* ---------- booleans ---------- */
        case 'OnRequest':
        case 'NonRefundable':
          ignored = true;
          data.metadata[localKey] =
            getXmlNodeText(rawValue).toLowerCase() === 'true';
          break;

        /* ---------- optional supplements ---------- */
        case 'OptionalSupplements':
          ignored = true;
          data.metadata[localKey] = normalizeToArray(rawValue).map((s: any) => ({
            id: Number(s.ContractSupplementID),
            name: getXmlNodeText(s.Supplement),
            total: Number(s.Value),
            description: formatNotes(getXmlNodeText(s.CustomerNotes)),
          }));
          break;

        /* ---------- optional special offers ---------- */
        case 'OptionalSpecialOffers':
          ignored = true;
          data.metadata[localKey] = normalizeToArray(rawValue).map((s: any) => ({
            id: Number(s.ContractSpecialOfferID),
            name: getXmlNodeText(s.OfferName),
            total: Number(s.TotalAmount),
            description: formatNotes(getXmlNodeText(s.OfferCustomerNotes)),
          }));
          break;

        /* ---------- errata ---------- */
        case 'Errata':
          ignored = true;
          data.metadata[localKey] = [];
          data.metadata.hotel_update = [];

          for (const e of normalizeToArray(rawValue)) {
            const desc = getXmlNodeText(e.ErratumDescription).trim();
            const exists = data.metadata[localKey].some(
              (x: any) =>
                getXmlNodeText(x.ErratumDescription).toLowerCase() ===
                desc.toLowerCase()
            );

            if (!exists) {
              data.metadata[localKey].push(e);
              if (
                getXmlNodeText(e.ErratumSubject).toLowerCase() ===
                'hotel update'
              ) {
                data.metadata.hotel_update.push(e);
              }
            }
          }
          break;

        /* ---------- seq ---------- */
        case 'Seq':
          localKey = 'room_number';
          localValue = Number(getXmlNodeText(rawValue));
          break;

        /* ---------- booking token ---------- */
        case 'RoomBookingToken':
          ignored = true;
          data.metadata[localKey] = getXmlNodeText(rawValue);
          break;

        /* ---------- property room type ---------- */
        case 'PropertyRoomTypeID':
          localKey = 'room_type_id';
          localValue = getXmlNodeText(rawValue);
          break;

        /* ---------- supplier details ---------- */
        case 'SupplierDetails':
          ignored = true;
          data.metadata.system_cost = getXmlNodeText(rawValue?.SystemCost?.[0]);
          data.metadata.source = getXmlNodeText(rawValue?.Source?.[0]);
          break;

        default:
          ignored = true;
          break;
      }

      if (!ignored) data[localKey] = localValue ?? null;
    }

    if (data.metadata.non_refundable === undefined)
      data.metadata.non_refundable = false;

    if (Array.isArray(data.metadata.optional_special_offers))
      data.metadata.optional_special_offers.sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      );

    result.push(data);
  }

  return result;
}


export function parsePropertyResult(property: any): ParsedProperty {
  const result: ParsedProperty = {};
  result.metadata = {};

  for (const key of Object.keys(property)) {
    const value = property[key]?.[0];
    let localKey = fromCamelCase(key);
    let localValue: any = null;

    switch (key) {
      case 'PropertyReferenceID':
        localKey = 'iv_reference_id';
        localValue = Number(getXmlNodeText(value));
        break;

      case 'GeographyLevel3ID':
        localKey = 'resort_id';
        localValue = Number(getXmlNodeText(value));
        break;

      case 'RoomTypes':
        try {
          result.import_rooms = parseRoomTypes(value);
        } catch (e) {
          console.error('RoomTypes parse failed', e);
          result.import_rooms = [];
        }
        break;

      case 'BookingToken':
        result.metadata[localKey] = getXmlNodeText(value);
        break;

      case 'SearchResponseXML':
        result.metadata.check_in_time =
          value?.Property?.[0]?.CheckInTime?.[0];
        result.metadata.check_out_time =
          value?.Property?.[0]?.CheckOutTime?.[0];
        break;

      default:
        break;
    }

    if (localValue !== null) result[localKey] = localValue;
  }

  if (Object.keys(result.metadata).length === 0) delete result.metadata;

  return result;
}

/* ===================== ENTRY POINT ===================== */
export async function parseIvectorXML(xml: string): Promise<any[]> {
  const parsed = await parseStringPromise(xml, {
    explicitArray: true,
    trim: true,
  });

  let propertyResults =
    parsed?.PropertySearchResponse?.PropertyResults?.[0]?.PropertyResult ?? [];

  // Normalize PropertyResult to array
  propertyResults = normalizeToArray(propertyResults);

  console.log('Number of PropertyResults parsed:', propertyResults.length);

  const parsedResults = propertyResults.map(parsePropertyResult);

  console.log('Parsed results preview:', parsedResults.slice(0, 3)); // first 3 props
  return parsedResults;
}
