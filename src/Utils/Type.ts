// Query / Params interface used by property APIs
export interface GetPropertiesParams {
  destinationId?: number;
  
}

// API response interface (optional but recommended)
export interface PropertyResponse {
  id: number;
  name: string;
  destination_id: number;
  destination_name: string;
  address: string;
  contact_number: string;
  description: string;
  region_name: string;
}
 export interface DestinationMetadata {
  contact?: string;
  address?: string;
  description?: string;
  airportIds?: number[];
}