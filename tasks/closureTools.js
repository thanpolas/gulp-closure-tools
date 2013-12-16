/**
 * Bootstrap file
 *
 */

var gutil = require('gulp-util');
var taskLib = require('task-closure-tools');

var cHelpers = taskLib.helpers;
var cBuilder = require('./closureBuilder');
var cCompiler = require('./closureCompiler');
var cDepsWriter = require('./closureDepsWriter');

var cTools = module.exports = {};

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

// Expose Tasks
cTools.helpers = taskLib.helpers;
cTools.builder = cBuilder;
cTools.compiler = cCompiler;
cTools.depsWriter = cDepsWriter;
cTools.closureOpts = taskLib.closureOpts;
