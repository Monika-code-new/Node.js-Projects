import { AsyncLocalStorage } from "async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

export function setContext(key: string, value: any) {
 const store = asyncLocalStorage.getStore();
 if (store) store.set(key, value);
}

export function getContext(key: string) {
 return asyncLocalStorage.getStore()?.get(key);
}
