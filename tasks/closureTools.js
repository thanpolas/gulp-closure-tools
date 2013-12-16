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

var cTools = module.exports = function(grunt) {

  // register the rest of the tasks
  cBuilder(grunt);
  cCompiler(grunt);
  cDepsWriter(grunt);

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
