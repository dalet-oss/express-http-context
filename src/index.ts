import { AsyncLocalStorage } from 'async_hooks'
import type { NextFunction, RequestHandler, Request, Response } from 'express'

declare global {
	// eslint-disable-next-line no-var
	var expressHttpContextStorage: AsyncLocalStorage<Map<string, any>>;
}


if (!global.expressHttpContextStorage) {
	global.expressHttpContextStorage = new AsyncLocalStorage<Map<string, any>>()
}



/**
 * Express.js middleware that is responsible for initializing the context for each request.
 */
export const middleware: RequestHandler = (
	_req: Request,
	_res: Response,
	next: NextFunction
): void => {
	global.expressHttpContextStorage.run(new Map(), () => next())
}

/**
 * Gets a value from the context by key.
 * Will return undefined if the context has not yet been initialized for this request
 * or if a value is not found for the specified key.
 */
export function get<T = any>(key: string): T | undefined {

	const store = global.expressHttpContextStorage.getStore();

	return store?.get(key)
}

/**
 * Adds a value to the context by key.
 * If the key already exists, its value will be overwritten.
 * No value will persist if the context has not yet been initialized.
 */
export function set<T = any>(key: string, value: T): void {

	const store = global.expressHttpContextStorage.getStore();

	store?.set(key, value)
}

export default { get, middleware, set }
