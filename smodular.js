// define/require part
var define;
(function (global, undefined) {
	var modules = {},
		document = global.document,
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

	function getCurrentName() {
		var fileSrc,
			reg = /\/([\w\.]+?)\.js/ig,
			m,
			scripts;

		if (document.currentScript) {
			fileSrc = document.currentScript.src;
		} else {
			scripts = document.getElementsByTagName('script');
			fileSrc = scripts[scripts.length-1].src;
		}
		m = reg.exec(fileSrc);
		if (m && m[1]) {
			return m[1];
		} else {
			throw new Error('Can\'n detect module name');
		}
	}

	function require(name, callback) {
		var currModule,
			names,
			current,
			i,
			returnExport;

		if ('object' === typeof name) {
			returnExport = [];
			for(i = 0; i < name.length; i++) {
				returnExport.push(require(name[i]));
			}
			if (callback) {
				callback.apply(callback, returnExport);
			}
			return returnExport;
		}

		name = mapModuleName((requires.length && requires[requires.length - 1]), name);
		if (!registredModules[name] && name.indexOf(APP) === 0) {
			names = name.split(SPLITTER);
			current = global;

			for (i = 0; i < names.length; i++) {
				if (current[names[i]] !== undefined) {
					current = current[names[i]];
				} else {
					throw new Error(NOT_FOUND + name);
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
				currModule = {exports : {}, name : name};
				returnExport = registredModules[name].factory.call(currModule.exports, require, currModule.exports, currModule);
				if (returnExport === undefined) {
					modules[name] = currModule.exports;
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
		global.define = function define(moduleName, factory, pseudoFactory) {
			if (!factory && typeof moduleName === 'function') { //anonymous fallback for AMD
				factory = moduleName;
				moduleName = getCurrentName();
			}
			if (typeof pseudoFactory === 'function') {
				if (factory.length === 0) {
					factory = pseudoFactory;
				} else {
					throw new Error('Supported only CommonJS way definition');
				}
			}
			if (registredModules[moduleName]) {
				throw new Error('Module already defined: ' + moduleName);
			}
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
