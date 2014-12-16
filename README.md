smodular
=========

Simple module for JavaScript. Supports AMD modules and CommonJS modules with wrapper (function _define_).

If module starts with name 'app.' then it will be inited imedantly and exported to global variable.

Exapmle of module:
``` javascript
 define('window', function (require, exports, module) {
	 module.exports = window;
 });
```
will export variable _window_ for other modules.
``` javascript
 define('app.nicemodule', function (require, exports, module) {
	 module.exports = function niceFunc(r) {
	  return 2 + r;
	 };
 });
```
 module exports _niceFunc_ to variable with name _app.nicemodule_
 
 If you concate all files to one, plese use some additional tool like *gulp-order* to difine correct order.
