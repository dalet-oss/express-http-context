import { Application, NextFunction, Request, Response } from 'express';
import httpContext from '../src';
import { nanoid } from 'nanoid';

const REQUEST_ID_HTTP_HEADER_NAME = 'my-request-id';
const REQUEST_ID_CONTEXT_KEY = 'myRequestId';

// less realistic, but useful for testing!
const REQUEST_ID_IN_RESPONSE_HTTP_HEADER_NAME = 'my-request-id-in-response'


function init(app: Application) {

    app.use(httpContext.middleware);

    app.use((req: Request, res: Response, next: NextFunction) => {
        const requestId: string = req.header(REQUEST_ID_HTTP_HEADER_NAME) || nanoid();

        httpContext.set<string>(REQUEST_ID_CONTEXT_KEY, requestId);
        res.header(REQUEST_ID_IN_RESPONSE_HTTP_HEADER_NAME, requestId);

        next();
    });
}


export {
    init,
    REQUEST_ID_CONTEXT_KEY,
    REQUEST_ID_IN_RESPONSE_HTTP_HEADER_NAME
}
