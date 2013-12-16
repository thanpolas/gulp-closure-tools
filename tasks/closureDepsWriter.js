/**
 * Copyright 2012 Thanasis Polychronakis. Some Rights Reserved.
 *
 * =======================
 *
 * closureBuilder.js Combines and optionally compiles javascript files
 *
 */

var es = require('event-stream');
var gutil = require('gulp-util');
var taskLib = require('task-closure-tools');
var cDepsWriter = taskLib.depsWriter;
var cHelpers = taskLib.helpers;

module.exports = function(opts) {

  var options = opts();

  if ( !cDepsWriter.validate( options ) ) {
    var err = new Error('FAILED to run closureDepsWriter task, Validation Error.');
    gutil.log(err.message);
    throw err;
  }

  function depsWriter(file, done) {
    var commands = [];
    var targetName = file;
    var errmsg;
    var fileObj = {
      src: file,
    };

    var cmd = cDepsWriter.createCommand( options, fileObj );

    if (cmd) {
      commands.push( {cmd: cmd, dest: targetName} );
    } else {
      errmsg = 'Failed to create command line for target: ' + targetName.red ;
      gutil.log(errmsg);
      return done(errmsg);
    }


    if (commands.length === 0) {
      errmsg = 'No commands produced for shell execution. Check your config file';
      gutil.log(errmsg);
      return done(errmsg);
    }

    // release the kraken!
    cHelpers.runCommands(commands, function(state) {
      if (!state) {
        return done('Failed to execute command');
      } else {
        done(null, file);
      }
    }, false, options.execOpts );
  } // depsWriter()

  return es.map(depsWriter);
};
