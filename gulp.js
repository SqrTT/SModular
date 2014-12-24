'use strict';
var through = require('through2'),
	PluginError = require('gulp-util/lib/PluginError');

function process(file, options) {

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
		var options = setup(opt);

		if (file.isNull()) {
			return callback(null, file);
		}

		if (file.isStream()) {
			return callback(createError(file, 'Streaming not supported'));
		}

		var done = process(file, options);

		if (done instanceof PluginError) {
			return callback(mangled);
		}

		file.contents = done;

		callback(null, file);
	});
};
