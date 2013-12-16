# Gulp Closure Tools

Google Closure Tools for [grunt](https://github.com/gruntjs/grunt):

* **[Compiler](https://developers.google.com/closure/compiler/)** Compile your JS code using the powerful google closure compiler
* **[Builder](https://developers.google.com/closure/library/docs/closurebuilder)** Concatenate your JS codebase to a single file, optionally also compile it
* **[DepsWriter](https://developers.google.com/closure/library/docs/depswriter)** Calculate dependencies of your JS files and generate `deps.js`

[![Build Status](https://travis-ci.org/closureplease/grunt-closure-tools.png?branch=master)](https://travis-ci.org/closureplease/grunt-closure-tools)

## Getting Started
Install the module with: `npm install grunt-closure-tools`

```shell
npm install grunt-closure-tools --save-dev
```

Then register the task by adding the following line to your `grunt.js`:

```javascript
grunt.loadNpmTasks('grunt-closure-tools');
```

#### Grunt 0.3.x compatibility

[**Migration Guide** from 0.3.x grunt config to 0.4.x](docs/changes_from_0.3.x_to_0.4.x.md)

To get a grunt 0.3.x. compatible version please install with:
```shell
npm install grunt-closure-tools@0.6.13 --save-dev
```

The Grunt 0.3.x repository can be found frozen [in this branch](https://github.com/closureplease/grunt-closure-tools/tree/grunt-0.3.x-STABLE).

## Documentation

All three tasks (compiler, builder and depswriter) are [multitasks](https://github.com/cowboy/grunt/blob/master/docs/types_of_tasks.md), so you can specify several targets depending on the complexity of your project.

### Closure Compiler

The Closure Compiler task has two requirements.

  1. **`compilerFile`** The location of the compiler. Find the latest compiler.jar file [here](http://closure-compiler.googlecode.com/files/compiler-latest.zip).
  2. **`src`** The js files you want to compile.

You can fully configure how the compiler will behave, by setting directives in the `options`. Every key will be used as a directive for the compiler.

You can use grunt file syntax (`<config:...>` or `path/**/*.js`) for the `js` directive and for declaring externs, set in `options.externs`.

Read more about the closure compiler [here](https://developers.google.com/closure/compiler/docs/api-tutorial3).

#### Sample Config for The Closure Compiler
```javascript
closureCompiler:  {

  options: {
    // [REQUIRED] Path to closure compiler
    compilerFile: 'path/to/closure/compiler.jar',

    // [OPTIONAL] set to true if you want to check if files were modified
    // before starting compilation (can save some time in large sourcebases)
    checkModified: true,

    // [OPTIONAL] Set Closure Compiler Directives here
    compilerOpts: {
      /**
       * Keys will be used as directives for the compiler
       * values can be strings or arrays.
       * If no value is required use null
       *
       * The directive 'externs' is treated as a special case
       * allowing a grunt file syntax (<config:...>, *)
       *
       * Following are some directive samples...
       */
       compilation_level: 'ADVANCED_OPTIMIZATIONS',
       externs: ['path/to/file.js', '/source/**/*.js'],
       define: ["'goog.DEBUG=false'"],
       warning_level: 'verbose',
       jscomp_off: ['checkTypes', 'fileoverviewTags'],
       summary_detail_level: 3,
       output_wrapper: '"(function(){%output%}).call(this);"'
    },
    // [OPTIONAL] Set exec method options
    execOpts: {
       /**
        * Set maxBuffer if you got message "Error: maxBuffer exceeded."
        * Node default: 200*1024
        */
       maxBuffer: 999999 * 1024
    }

  },

  // any name that describes your task
  targetName: {

    /**
     *[OPTIONAL] Here you can add new or override previous option of the Closure Compiler Directives.
     * IMPORTANT! The feature is enabled as a temporary solution to [#738](https://github.com/gruntjs/grunt/issues/738).
     * As soon as issue will be fixed this feature will be removed.
     */
    TEMPcompilerOpts: {
    }

    // [OPTIONAL] Target files to compile. Can be a string, an array of strings
    // or grunt file syntax (<config:...>, *)
    src: 'path/to/file.js',

    // [OPTIONAL] set an output file
    dest: 'path/to/compiled_file.js'
  }
}
```
Closure compiler is typically used to produce a single output file out of multiple input files. For such scenario you specify `src` and `dest` properties as in the sample above.
Grunt, however, has richer support for specifying **[source-destination mappings](http://gruntjs.com/configuring-tasks#files)** and you can leverage it for accomplishing
other compilation scenarios, e.g. compiling a single output file out of each source file as demonstrates the sample below. To support also generation of source maps for this case
you can specify `create_source_map` in **compilerOpts** with value set to `null`. This causes passing the `dest` filename with suffix `.map` to closure compiler's `create_source_map` parameter
(this behavior is valid only when source-destination file mapping is specified for processing).
```javascript
closureCompiler: {
    options: {
		// most options here omitted for brevity

		compilerOpts: {
			// most options here omitted for brevity

			create_source_map: null,

			/**
			 * When 'create_source_map' with value set to null is defined here AND the dest file is specified in
			 * the form of source-destination file mapping, the name of dest file extended with '.map' is passed
			 * as value of parameter 'create_source_map' to the compiler to enable a source map file per output file.
			 * E.g. for
			 *	 files: [
			 *		{src: 'lib/a.js', dest: 'build/a.min.js'},
			 *		{src: 'lib/b.js', dest: 'build/b.min.js'},
			 *	  ],
			 * the value of 'create_source_map' would be 'build/a.min.js.map' for the first mapping
			 * and 'build/b.min.js.map' for the second one.
			 */
		}
	},
	minify: {
		/**
		 * Following sample uses dynamically created mappings, where src array of globs is evaluated
		 * and dest file is constructed for each source file by replacing its extension with '.min.js'.
		 */
		files: [
			{
				expand: true,
				src: ['**/*.js', '!**/*.min.js'],
				ext: '.min.js'
			}
		]
	}
}
```

### Closure Builder

The Closure Builder task has 3 required directives:

  1. A way to find the `closurebuilder.py` file. One of the following two directives are required:
    * **`closureLibraryPath`** A path to the Google Closure Library. From there we can infer the location of the closurebuilder.py file
    * **`builder`** Directly reference the closurebuilder.py file
  2. An input method must be defined. One of the following two directives is required:
    * **`inputs`** String, array or grunt file syntax to define build targets
    * **`namespaces`** String or array to define namespaces to build
  3. The root targets of the closureBuilder. These are defined in the:
    * **`src`** option of each target. Can be string or array.

The builder has the ability to compile *on-the-fly* the built files. To enable this option you need to set the option `compile` to boolean `true` and then set the location of the `compiler.jar` file via the `compiler` directive.

You can set all the compiler directives in the `compiler_options` object. The `js` directive is no longer required, as the builder takes care of that. The compiler directives follow the same logic as the ones in the Closure Compiler multitask described above.

Read more about the closure builder in [this link](https://developers.google.com/closure/library/docs/closurebuilder).

#### Sample Config for The Closure Builder

```javascript
closureBuilder:  {
  options: {
    // [REQUIRED] To find the builder executable we need either the path to
    //    closure library or directly the filepath to the builder:
    closureLibraryPath: 'path/to/closure-library', // path to closure library
    // [OPTIONAL] You can define an alternative path of the builder.
    //    If set it trumps 'closureLibraryPath' which will not be required.
    builder: 'path/to/closurebuilder.py',

    // [REQUIRED] One of the two following options is required:
    inputs: 'string|Array', // input files (can just be the entry point)
    namespaces: 'string|Array', // namespaces

    // [OPTIONAL] The location of the compiler.jar
    // This is required if you set the option "compile" to true.
    compilerFile: 'path/to/compiler.jar',

    // [OPTIONAL] output_mode can be 'list', 'script' or 'compiled'.
    //    If compile is set to true, 'compiled' mode is enforced.
    //    Default is 'script'.
    output_mode: '',

    // [OPTIONAL] if we want builder to perform compile
    compile: false, // boolean

    compilerOpts: {
      /**
      * Go wild here...
      * any key will be used as an option for the compiler
      * value can be a string or an array
      * If no value is required use null
      */
    },
    // [OPTIONAL] Set exec method options
    execOpts: {
       /**
        * Set maxBuffer if you got message "Error: maxBuffer exceeded."
        * Node default: 200*1024
        */
       maxBuffer: 999999 * 1024
    }

  },

  // any name that describes your operation
  targetName: {

    // [REQUIRED] paths to be traversed to build the dependencies
    src: 'string|Array',

    // [OPTIONAL] if not set, will output to stdout
    dest: ''
  }
}
```

### Closure DepsWriter

The Closure DepsWriter task has 1 required directive:

  1. A way to find the `depswriter.py` file. One of the following two directives is required:
    * **`closureLibraryPath`** A path to the Google Closure Library. From there we can infer the location of the depswriter.py file
    * **`depswriter`** Directly reference the depswriter.py file

Read more about depswriter [here](https://developers.google.com/closure/library/docs/depswriter).

#### Sample Config for The Closure DepsWriter

```javascript
closureDepsWriter: {
  options: {
    // [REQUIRED] To find the depswriter executable we need either the path to
    //    closure library or the depswriter executable full path:
    closureLibraryPath: 'path/to/closure-library',

    // [OPTIONAL] Define the full path to the executable directly.
    //    If set it trumps 'closureLibraryPath' which will not be required.
    depswriter: 'path/to/depswriter.py', // filepath to depswriter

    // [OPTIONAL] Root directory to scan. Can be string or array
    root: ['source/ss', 'source/closure-library', 'source/showcase'],

    // [OPTIONAL] Root with prefix takes a pair of strings separated with a space,
    //    so proper way to use it is to suround with quotes.
    //    can be a string or array
    root_with_prefix: '"source/ss ../../ss"',

    // [OPTIONAL] string or array
    path_with_depspath: ''


  },
   // any name that describes your operation
  targetName: {

    // [OPTIONAL] Set file targets. Can be a string, array or
    //    grunt file syntax (<config:...> or *)
    src: 'path/to/awesome.js',

    // [OPTIONAL] If not set, will output to stdout
    dest: ''

  }
}
```

## Release History

- **v0.1.0**, *16 Dec 2013*
  - First port of `grunt-closure-tools` package to Gulp.

## License
Copyright (c) 2013 Thanasis Polychronakis
Licensed under the [MIT license](LICENSE-MIT).
