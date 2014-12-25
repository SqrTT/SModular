'use strict';
var through = require('through2'),
	PluginError = require('gulp-util/lib/PluginError'),
	pluginName = 'smodular';

function process(file, options) {
	var regName = /\/([\w]+?)\..+?$/ig,
		libName,
		m,
		data;

	m = regName.exec(file.path);
	if (m && m[1]) {
			libName = m[1];
	} else {
			throw 'Can\'n detect module name';
	}

	var data = String(file.contents);
	data = data.replace(/define\s*?\(\s*?(function|factory|\[)/igm, 'define(\'' + libName + '\', $1');

	return new Buffer(data);
}


function createError(file, err) {
	if (typeof err === 'string') {
		return new PluginError(pluginName, file.path + ': ' + err, {
			fileName: file.path,
			showStack: false
		});
	}

	var msg = err.message || err.msg || /* istanbul ignore next */ 'unspecified error';

	return new PluginError(pluginName, file.path + ': ' + msg, {
		fileName: file.path,
		lineNumber: err.line,
		stack: err.stack,
		showStack: false
	});
}

module.exports = function(opt) {

	return through.obj(function (file, encoding, callback) {

		if (file.isNull()) {
			return callback(null, file);
		}

		if (file.isStream()) {
			return callback(createError(file, 'Streaming not supported'));
		}

		var done = process(file);

		if (done instanceof PluginError) {
			return callback(done);
		}

		file.contents = done;

		callback(null, file);
	});
};
