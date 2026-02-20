"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncLocalStorage = void 0;
exports.setContext = setContext;
exports.getContext = getContext;
const async_hooks_1 = require("async_hooks");
exports.asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
function setContext(key, value) {
    const store = exports.asyncLocalStorage.getStore();
    if (store)
        store.set(key, value);
}
function getContext(key) {
    return exports.asyncLocalStorage.getStore()?.get(key);
}
