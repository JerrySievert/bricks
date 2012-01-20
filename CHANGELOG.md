## Changes

### 1.1.3 - January 20, 2012

* expand method signature of `response.checkRoute()`

### 1.1.2 - January 13, 2012

* `plugin.request` added `request.body` for `PUT` and `POST`
* update `createServer` to allow for options for `https`
* removed dependency on `date-utils`, added dependency on `cromag`

### 1.1.1 - December 4, 2011

* `plugin.meta` added to plugin definition
  * `author` - author name
  * `email` - author email
  * `name` - plugin name
  * `description` - plugin description
* `plugin.name` deprecated in favor of `plugin.meta.name`
* added `html` and `callback` to `404 handler`
* added headers, expiration, and modification checks to `filehandler plugin`
  * added `options.timeout` for cache headers
  * added `304` response for `If-Modified-Since` headers

### 1.1.0 - November 27, 2011

* `addRoute()` now returns `routeId` instead of `this` - BREAKING CHANGE
* added `removeRoute(routeId)` 
* updated to `EventEmitter2` current - BREAKING CHANGE

### 1.0.9 - October 25, 2011

* removed regular expression test causing exception in 0.5.10
* ready for node.js v0.6.0, and verified working on windows

### 1.0.8 - October 2, 2011

* added session to request in session plugin
* lower node.js version requirement
* added request plugin
  * POST parameter handling
  * request url parsing
