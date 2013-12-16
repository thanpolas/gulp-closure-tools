/*jshint camelcase:false */
/**
 * Copyright 2012 Thanasis Polychronakis.
 *
 * =======================
 *
 * closureBuilder.js Combines and optionally compiles javascript files
 *
 */

var es = require('event-stream');
var gutil = require('gulp-util');
var taskLib = require('task-closure-tools');
var cBuilder = taskLib.builder;
var cHelpers = taskLib.helpers;

module.exports = function(dest, opts) {

  var options = opts;

  //
  // Validations
  // - Check required parameters
  //
  if ( !cBuilder.validate( options )) {
    var err = new Error('FAILED to run closureBuilder task, Validation Error.');
    gutil.log(err.message);
    throw err;
  }


  function closureBuilder(file, done) {
    console.log('FILE\n',file);
    //
    // Prepare and compile the command string we will execute
    //
    // Iterate over all specified file groups.
    var commands = [];
    var targetName = dest;
    var fileObj = {
      src: file.path,
    };
    var errmsg;

    if ( !cBuilder.validateFileObj(options, fileObj)) {
      errmsg = 'Failed validations for target: ' + gutil.colors.red(targetName);
      gutil.log(errmsg);
      return done(errmsg);
    }

    var cmd = cBuilder.createCommand(options, fileObj);

    if (cmd) {
      commands.push( {cmd: cmd, dest: targetName, fileObj: fileObj} );
    } else {
      errmsg = 'Failed to create command line for target: ' +
        gutil.colors.red(targetName);
      gutil.log(errmsg);
      return done(errmsg);
    }

    if ( 0 === commands.length ) {
      errmsg = 'No commands produced for shell execution. Check your config file';
      gutil.log(errmsg);
      return done(errmsg);
    }

    //
    // Execute the compile command on the shell.
    //
    //
    cHelpers.runCommands( Array.prototype.slice.call(commands, 0), function(state) {
      if (!state) {
        done('Command execution failed');
        return;
      }
      cHelpers.runStats( Array.prototype.slice.call(commands, 0), options,
        function(state) {
          if (!state) {
            return done('Stats Failed to generate');
          }
          done(null, file);
        });
    }, false, options.execOpts);
  } // closureBuilder()


  return es.map(closureBuilder);
};
