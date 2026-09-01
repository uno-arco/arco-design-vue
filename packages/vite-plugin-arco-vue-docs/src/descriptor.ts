const cache = new Map<string, string>();

const cacheKey = (id: string) => id.split('?')[0].replace(/\\/g, '/');

export const createDescriptor = (id: string, content: string) => {
  cache.set(cacheKey(id), content);
};

export const getDescriptor = (id: string) => {
  return cache.get(cacheKey(id));
};
