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
var ssCompiler = require('superstartup-closure-compiler');


var gulpClosuretools = require('./');

gulp.task('depsWriter', function() {
  gulp.src('test/case') // src is irrelevant for the depsWriter task
    .pipe(gulpClosuretools.depsWriter('temp/deps.js', {
      root: 'test/case',
      depswriter: cTools.getPath('build/depswriter.py'),
    }));
});


gulp.task('compile', function() {
  gulp.src('temp/build.bundled.js')
    .pipe(gulpClosuretools.compiler('temp/compiler.compiled.js', {
      compilerFile: ssCompiler.getPathSS(),
      compilerOpts: {
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        warning_level: 'verbose',
        externs: 'test/case/externs.js',
        summary_detail_level: 3,
        output_wrapper: '"(function(){%output%}).call(this);"',
      },
    }));
});
