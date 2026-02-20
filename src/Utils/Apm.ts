/* import newrelic from "newrelic"

export const APM = {
 trace: newrelic.startSegment,
 error: newrelic.noticeError,
 attr: newrelic.addCustomAttributes
}
 */
import newrelic from "newrelic";

export const APM = {

 attr: (data: Record<string, any>) => {
  newrelic.addCustomAttributes(data);
 },

 error: (err: unknown) => {
  if (err instanceof Error) {
   newrelic.noticeError(err);
  } else {
   newrelic.noticeError(new Error(JSON.stringify(err)));
  }
 },

 segment: async (name: string, fn: () => Promise<any>) => {
  return newrelic.startSegment(name, true, fn);
 }

};
