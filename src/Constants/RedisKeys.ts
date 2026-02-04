export const redisKeys = {
  status: (id: string) => `search:${id}:status`,
  results: (id: string) => `search:${id}:results`,
};
