SModular - Simple Modular
=========

Simple module for JavaScript. Supports AMD modules and CommonJS modules with wrapper (function _define_).


Exapmles
--------
If module starts with name 'app.' then it will be inited imedantly and exported to global variable in other case module will not be global but still can by required by other module.

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
 
 Other way define module is return function or object what you want to export as AMD approach.
 ``` javascript
 define('app.nicemodule', function (require, exports, module) {
 	return function niceFunc(r) {
		return 2 + r;
	};
 });
```
Result will be the same as one above.
After definition you can require module in other.
 ``` javascript
 define('app.secondmodule', function (require, exports, module) {
 	var nicemodule = require('app.nicemodule');
	return function niceFunc(r) {
		return 2 + nicemodule(3);
	};
 });
```
There is other way to define module. Module can be anomymous. In that case module id/name will be file name without extention but pay attention it will not work when you concat all files to one.
 ``` javascript
 // filename: app.secondmodule.js
 // module will have name app.secondmodule
 define(function (require, exports, module) {
 	var nicemodule = require('app.nicemodule');
	return function niceFunc(r) {
		return 2 + nicemodule(3);
	};
 });
```

If you concate all files to one, plese use some additional tool like *gulp-order* to difine correct order.
SModular will not load moule automaticly you shoud do it manualy and of course in right order.
