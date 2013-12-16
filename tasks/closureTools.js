/**
 * Bootstrap file
 *
 */

var es = require('event-stream');
var gutil = require('gulp-util');
var taskLib = require('task-closure-tools');

var cHelpers = taskLib.helpers;
var cBuilder = require('./closureBuilder');
var cCompiler = require('./closureCompiler');
var cDepsWriter = require('./closureDepsWriter');

var cTools = module.exports = {};


cTools.builder = function(opts) {
  return es.map(cTools.run.bind(null, opts));
};

/**
 * Executes.
 *
 * @param {Object} opts Options passed.
 * @param {string} file the filename.
 * @param {Function} done the callback.
 */
cTools.run = function(opts, file, done) {

  done(null, file);
};

// overwrite helper's logging methods
cHelpers.log = {
  warn: function(msg) { gutil.log('WARN ::', msg); },
  info: function(msg) { gutil.log('INFO ::', msg); },
  error: function(msg) { gutil.log('ERROR ::', msg); },
  debug: function(debug, msg) {
    if ( !debug ) return;
    gutil.log( 'DEBUG :: '.blue + msg );
  }
};

// Expose internal API
cTools.helpers = taskLib.helpers;
cTools.builder = taskLib.builder;
cTools.compiler = taskLib.compiler;
cTools.depsWriter = taskLib.depsWriter;
cTools.closureOpts = taskLib.closureOpts;
