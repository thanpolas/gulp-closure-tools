/*jshint camelcase:false */
/*
 * Gulp Closure Tools
 * https://github.com/thanpolas/gulp-closure-tools
 *
 * Copyright (c) 2013 Thanasis Polychronakis
 * Licensed under the MIT license.
 */
var gulp = require('gulp');
var cTools = require('closure-tools');


var gulpClosuretools = require('./');

gulp.task('depsWriter', function() {
  gulp.src('test/case') // src is irrelevant for the depsWriter task
    .pipe(gulpClosuretools.depsWriter('temp/deps.js', {
      root: 'test/case',
      depswriter: cTools.getPath('build/depswriter.py'),
    }));
});
