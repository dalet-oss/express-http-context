import { AsyncLocalStorage } from 'async_hooks';
import type { NextFunction, Request, Response } from 'express';


declare global {
	// eslint-disable-next-line no-var
	var expressHttpContextStorage: AsyncLocalStorage<Map<string, any>>;
}


if (!global.expressHttpContextStorage) {
	global.expressHttpContextStorage = new AsyncLocalStorage<Map<string, any>>();
}


/**
 * Express.js middleware that is responsible for initializing the context for
 * each request.
 *
 * Declared as type 'any' because otherwise Typescript consumers can get tie
 * themselves in knots.
 */
export const middleware: any = (
	_req: Request,
	_res: Response,
	next: NextFunction
): void => {
	global.expressHttpContextStorage.run(new Map(), () => next());
}


/**
 * Gets a value from the context by key.
 *
 * Will return undefined if the context has not yet been initialized for this
 * request, or if a value is not found for the specified key.
 */
export function get<T = any>(key: string): T | undefined {

	const store = global.expressHttpContextStorage.getStore();

	return store?.get(key);
}


/**
 * Adds a value to the context by key.
 *
 * If the key already exists, its value will be overwritten.
 * No value will be persisted if the context has not yet been initialized.
 *
 * Returns the value that was set, or undefined if the context has not yet been
 * initialized for this request.
 */
export function set<T = any>(key: string, value: T): T | undefined {

	const store = global.expressHttpContextStorage.getStore();

    if (store) {
        store.set(key, value);
        return value;
    }

    return undefined;
}


export default { get, middleware, set }
