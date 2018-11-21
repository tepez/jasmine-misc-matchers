'use strict';
const Gulp = require('gulp');
const TypescriptBuildGulpTasks = require('@tepez/typescript-build-gulp-tasks');

// These files are executed executeSpecFile so they should not in the build files not the spec files
TypescriptBuildGulpTasks.getConfig().build.srcFiles.push(
    '!src/failSpecs/**'
);

TypescriptBuildGulpTasks.register(Gulp);