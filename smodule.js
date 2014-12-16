// define/require part
var define;
(function (global, undefined) {
	var modules = {},
		registredModules = {},
		ASTERISK = '*',
		APP = 'app.',
		MAX_LOOP_DEEP = 30,
		SPLITTER = '.',
		NOT_FOUND = 'Module not found: ',
		requires = [],
		modulesMap = {};

	function mapModuleName(defName, reqName) {
		if (defName && modulesMap[defName] && modulesMap[defName][reqName]) {
			return modulesMap[defName][reqName];
		}
		if (modulesMap[ASTERISK] && modulesMap[ASTERISK][reqName]) {
			return modulesMap[ASTERISK][reqName];
		}
		return reqName;
	}

	function require(name) {
		var module,
			names,
			current,
			i,
			returnExport;

		name = mapModuleName((requires.length && requires[requires.length - 1]), name);
		if (!registredModules[name] && name.indexOf(APP) === 0) {
			names = name.split(SPLITTER);
			current = global;

			for (i = 0; i < names.length; i++) {
				if (current[names[i]] !== undefined) {
					current = current[names[i]];
				} else {
					throw NOT_FOUND + name;
				}
			}
			return current;
		} else if (modules[name]) {
			return modules[name];
		} else if (registredModules[name]) {
			if (requires.length > MAX_LOOP_DEEP || requires.indexOf(name) > 0) {
				throw 'Loop detected: ' + requires + '->' + name;
			} else {
				requires.push(name);
				module = {exports : {}, name : name};
				returnExport = registredModules[name].factory.call(module.exports, require, module.exports, module);
				if (returnExport === undefined) {
					modules[name] = module.exports;
				} else {
					modules[name] = returnExport;
				}
				requires.pop();
				return modules[name];
			}
		} else {
			throw NOT_FOUND + name;
		}
	}

	if (!global.define) {
		global.define = function define(moduleName, factory) {
			registredModules[moduleName] = {factory : factory, name: moduleName};
			if (moduleName.indexOf(APP) === 0) {
				var names = moduleName.split(SPLITTER),
					current = global,
					i = 0;

				for (; i < names.length - 1; i++) {
					if (!current[names[i]]) {
						current[names[i]] = {};
					}
					current = current[names[i]];
				}
				current[names[i]] = require(moduleName);
			}
		};
		global.define.map = modulesMap;
		global.define.amd = {};// look alike AMD
	}
}(this));
/// define some basic modules
define('window', function (require, exports, module) {
	module.exports = window;
});
define('document', function (require, exports, module) {
	module.exports = require('window').document;
});
define('$', function (require, exports, module) {
	module.exports = require('jquery');
});
define('$doc', function (require, exports, module) {
	module.exports = require('$')(require('document'));
});
define('$win', function (require, exports, module) {
	module.exports = require('$')(require('window'));
});
define('$body', function (require, exports, module) {
	module.exports = require('$')('body');
});
define('console', function (require, exports, module) {
	module.exports = require('window').console;
});
define('gevent', function (require, exports, module) {
	module.exports = require('$doc');
});