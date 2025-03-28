[![NPM Version](https://img.shields.io/npm/v/%40dalet-oss%2Fexpress-http-context)](https://www.npmjs.com/package/@dalet-oss/express-http-context)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/dalet-oss/express-http-context/ci-publish.yml)](https://github.com/dalet-oss/express-http-context/actions)


# Express HTTP Context
Modern request-scoped storage support for Express.js, based on native Node.js
Asynchronous Local Storage. It's a great place to store user state, claims from
a JWT, request/correlation IDs, and any other request-scoped data.

This package is a drop-in replacement and has been inspired by the work done in
[express-http-context](https://github.com/skonves/express-http-context), but
with ESM support, no dependencies, and only supporting modern versions of
Node.js (+v14).

The implementation is derived from the start made in
[express-http-context2](https://github.com/artberri/express-http-context2).
We diverged to support our own implementation because the bug highlighted in
[artberri/express-http-context2#1](https://github.com/artberri/express-http-context2/issues/1)
was ultimately ignored and the repository apparently abandoned by its maintainer.


## Installation

```bash
npm install @dalet-oss/express-http-context
# or
yarn add @dalet-oss/express-http-context
# or
pnpm add @dalet-oss/express-http-context
```

> **Requirements**
>
> `@dalet-oss/express-http-context` is a middleware intended for `express`, so
> although it is not explicitly declared as a dependency or peer dependency, it
> requires `express` to work, as well as `@types/express` if you are using
> Typescript. The reason the dependency is not explicitly declared is that it
> could also eventually be used with `fastify` or other Node.js HTTP servers.

## Configuration

Use the middleware immediately before the first middleware that needs to have access to the context. You won't have access to the context in any middleware "used" before this one.

```js
const express = require('express')
const httpContext = require('@dalet-oss/express-http-context')

const app = express()
// Use any third party middleware that does not need to access the context here, e.g.
// app.use(some3rdParty.middleware);
app.use(httpContext.middleware)
// All code from this point on will have access to the per-request context
```

Note that some popular middlewares (such as `body-parser`, `express-jwt`) can
cause the context to be lost. To work around such problems, it is recommended
that you use any third-party middleware that does NOT require the context
BEFORE using this middleware.

## Usage

Examples of setting values:

```js
const httpContext = require('@dalet-oss/express-http-context')
const { nanoid } = require('nanoid') // This is just an example, nanoid is not included in this lib

app.use((req, res, next) => {
	// Get the user ID from wherever and save it for later use...
	httpContext.set('userId', userId)
	// Create a request ID to be able to trace/correlate everything that happens within the same request
	httpContext.set('requestId', nanoid())
})
```

Get them from anywhere in your code:

```js
var httpContext = require('@dalet-oss/express-http-context')

function logError(error) {
	const userId = httpContext.get('userId')
	const requestId = httpContext.get('requestId')
	console.error(error, { userId, requestId })
}
```

## API

### middleware

It is an Express.js middleware that is responsible for initializing the
independent context for each request. The `get` and `set` calls will operate on
a set of keys/values unique to those contexts.

#### Example

```js
import { middleware } from '@dalet-oss/express-http-context'

app.use(middleware)
```

### set

Adds a value to the request context by key.
If the key already exists, its value will be overwritten.
No value will persist if the context has not yet been initialized.

#### Parameters

- `key` a string key to store the variable by
- `value` any value to store under the key for the later lookup.

#### Example

```js
import { set } from '@dalet-oss/express-http-context'

set('user', { id: 'overwrittenUser', email: 'foo@bar.com' })
```

### get

Gets a value from the request context by key.
Will return `undefined` if the context has not yet been initialized for this
request or if a value is not found for the specified key.

#### Parameters

- `key` a string key to retrieve the stored value for

#### Example

```js
import { get } from '@dalet-oss/express-http-context'

const user = get('user')
```

## License

MIT License.  See [LICENSE](LICENSE).


## Contributors
* Oliver Lockwood (@oliverlockwood)
* Alberto Varela Sánchez (@artberri)

Interesting in contributing? Take a look at the [Contributing Guidlines](/CONTRIBUTING.md)
