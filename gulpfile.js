var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

gulp.task("default", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify, { global: true })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
});