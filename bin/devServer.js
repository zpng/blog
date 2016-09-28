#!/usr/bin/env node

'use strict';

var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var gulp = require('gulp');
var staticFiles = require('../index.json');
var gulpfile = require('../gulpfile');
var order = require('gulp-order');
var through = require('through');
var path = require('path');
var ROOT = path.resolve(gulpfile.SRC);
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var tap = require('gulp-tap');
var merge = require('merge-stream');
var gutil = require('gulp-util');

app.get('/seed.js', function (req, res) {
    res.set('Content-Type', 'text/javascript');

    merge(gulp.src(staticFiles.scripts, {
        read: false
    }), gulp.src([
        gulpfile.SRC + '**/*.js',
        '!' + gulpfile.SRC + 'bower_components/**/*.*',
        '!' + gulpfile.SRC + 'seed.js'
    ], {
        read: false
    })).pipe(order(staticFiles.scripts.concat([
        gulpfile.SRC + 'app.js',
        gulpfile.SRC + 'ngImgCrop/ng-img-crop.js',
        gulpfile.SRC + '**/*.js'
    ]), {
        base: './'
    }))
    .pipe((function () {
        var files = [];
        return through(function (file) {
            files.push(file.path.substr(ROOT.length).replace(/\\/g, '/'));
        }, function () {
            res.send(files.map(function (file) {
                return 'document.write(\'<script src="' + file + '"></script>\');';
            }).join('\n') + '\ndocument.write(\'<link rel="stylesheet" href="/app.css">;\')');
        });
    }()));
});

app.get('/app.css', function (req, res) {
    res.set('Content-Type', 'text/css');

    gulp.src(gulpfile.SRC + 'app.less')
        .pipe(sourcemaps.init())
        .pipe(less({
            lint: true,
            noIeCompat: true,
            relativeUrls: true
        }))
        .pipe(sourcemaps.write())
        .pipe(tap(function (file) {
            res.send(file.contents);
        }));
});

app.use('/app.manifest', function (req, res) {
    res.status(200).send('CACHE MANIFEST\nNETWORK:\n*');
});

app.use(serveStatic('src', {
    index: ['index.html']
}));

app.listen(3000, function () {
    gutil.log('Development server listening on http://127.0.0.1:3000');
});
