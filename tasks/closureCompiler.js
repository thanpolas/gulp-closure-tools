/*jshint camelcase:false */

/**
 * Copyright 2012 Thanasis Polychronakis. Some Rights Reserved.
 *
 * =======================
 *
 * closureCompiler.js Combines and optionally compiles javascript files
 *
 */

/**
 * The closureCompiler grunt task
 *
 */

var es = require('event-stream');
var gutil = require('gulp-util');
var taskLib = require('task-closure-tools');
var cCompiler = taskLib.compiler;
var cHelpers = taskLib.helpers;

module.exports = function(dest, opts) {
  var options = opts;
  if ( !cCompiler.validateOpts( options ) ) {
    gutil.log('ERROR :: closureCompiler Task Failed :: Options');
    return;
  }


  function closureCompiler(file, done) {
    var commands = [];
    var targetName = dest;

    var fileObj = {
      src: file.path,
      dest: dest,
    };
    var errmsg;

    if ( !cCompiler.validateFile( fileObj ) ) {
      var err = new Error('FAILED to run closureCompiler task, Validation Error.');
      gutil.log(err.message);
      throw err;
    }
    var cmd = cCompiler.compileCommand( options, fileObj );

    if ( cmd ) {
      commands.push( {cmd: cmd, dest: targetName} );
    } else if (!options.checkModified) {
      errmsg = 'Failed to create command line for target: ' +
        gutil.colors.red(targetName);
      gutil.log(errmsg);
      return done(errmsg);
    }

    if (commands.length === 0) {
      if (options.checkModified) {
        return done(null, file);
      }
      errmsg = 'No commands produced for shell execution. Check your config file';
      gutil.log(errmsg);
      return done(errmsg);
    }
    // release the kraken!
    cHelpers.runCommands( commands, function(state) {
      if (!state) {
        return done('Failed to execute command');
      } else {
        done(null, file);
      }
    }, false, options.execOpts );

  } // closureCompiler()

  return es.map(closureCompiler);
};
