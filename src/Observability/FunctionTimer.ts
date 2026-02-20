import { logger } from "./Logger";

type TimerMeta = Record<string, unknown>;

export async function timeFunction<T>(
  functionName: string,
  fn: () => Promise<T>,
  meta: TimerMeta = {}
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    logger.info("Function completed", {
      type: "function",
      functionName,
      durationMs: Date.now() - start,
      ...meta
    });
    return result;
  } catch (error: any) {
    logger.error("Function failed", {
      type: "function",
      functionName,
      durationMs: Date.now() - start,
      error: error?.message ?? String(error),
      ...meta
    });
    throw error;
  }
}
