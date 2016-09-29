/*jshint node:true*/

'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var fileCache = require('gulp-cache');
var less = require('gulp-less');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var merge = require('merge-stream');
var order = require('gulp-order');
var staticFiles = require('./index.json');
var rev = require('gulp-rev');
var override = require('gulp-rev-css-url');
var revCollector = require('gulp-rev-collector');
var manifest = require('gulp-manifest');
var tap = require('gulp-tap');
var uglify = require('gulp-uglify');
var crypto = require('crypto');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var cleanCSS = new LessPluginCleanCSS({
    advanced: true
});
var del = require('del');
var vinylPaths = require('vinyl-paths');
var gls = require('gulp-live-server');
var gutil = require('gulp-util');
var debug = require('debug');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var rework = require('rework');
var reworkPluginURL = require('rework-plugin-url');
var through2 = require('through2');
var _ = require('underscore');

var CDN = gutil.env.cdn || '/';
if (CDN[CDN.length - 1] !== '/') {
    CDN = CDN + '/';
}
debug('init')('CDN=%s', CDN);

var tapDebug = function (name, showContent) {
    var logger = debug(name);
    return tap(function (file) {
        if (showContent) {
            logger(file.path, file.contents.toString().substr(0, 1024));
        } else {
            logger(file.path);
        }
    });
};

var BUILD = 'dist/';
var SRC = 'src/';

function makeHashKey(cache) {
    return function (file) {
        var shasum = crypto.createHash('sha1');
        shasum.update(file.contents);
        return cache + '|' + shasum.digest('hex');
    };
}

function scripts() {
    var scriptFiles = merge(gulp.src(staticFiles.scripts, {
        base: SRC
    }), gulp.src([
        SRC + '**/*.js',
        '!' + SRC + 'bower_components/**/*.*',
        '!' + SRC + 'seed.js'
    ], {
        base: SRC
    }));

    var template = gulp.src([
        SRC + '**/*.html',
        '!' + SRC + 'bower_components/**/*.*',
        '!' + SRC + 'index.html'
    ]).pipe(templateCache('templates.js', {
        module: 'blog-web'
    }));

    return merge(scriptFiles, template)
        .pipe(order(staticFiles.scripts.concat([
            SRC + 'app.js',
            SRC + 'ngImgCrop/ng-img-crop.js',
            SRC + '**/*.js',
            'templates.js'
        ]), {
            base: './'
        }))
        .pipe(fileCache(uglify(), {
            key: makeHashKey('uglify')
        }))
        .pipe(concat({
            path: 'app.js',
            newLine: ';'
        }));
}

function styles() {
    return gulp.src(SRC + 'app.less')
        .pipe(less({
            lint: true,
            noIeCompat: true,
            relativeUrls: true,
            plugins: [cleanCSS]
        }))
        .pipe(concat({
            path: 'app.css'
        }))
        .pipe(tapDebug('styles'));
}

function images() {
    var allImages =  gulp.src([
        '!' + SRC + 'bower_components/**/*.*',
        SRC + '**/*.png',
        SRC + '**/*.jpg',
        SRC + '**/*.gif',
        SRC + '**/*.svg',
        SRC + '**/*.ico'
    ], {
        base: SRC
    });

    var cssImages = styles()
        .pipe(through2.obj(function (chunk, enc, cb) {
            var files = [];
            rework(chunk.contents.toString())
            .use(reworkPluginURL(function (url) {
                if (url.indexOf('?') !== -1) {
                    url = url.substr(0, url.indexOf('?'));
                }
                files.push(SRC + url);
            }));

            files = _.uniq(files);
            var self = this;

            gulp.src(files, {
                base: SRC
            }).pipe(through2.obj(function (chunk, enc, cb) {
                self.push(chunk);
                cb();
            }, function () {
                cb();
            }));
        }));

    return merge(allImages, cssImages).pipe(tapDebug('image'));
}

// tasks ------------------------------------------------------------

gulp.task('jshint', function () {

    return gulp.src([
        SRC + '**/*.js',
        'gulpfile.js',
        '!' + SRC + 'bower_components/**/*.js',
    ], {
        base: SRC
    })
        .pipe(fileCache(jshint(), {
            success: function (jshintedFile) {
                return jshintedFile.jshint.success;
            }
        }))
        .pipe(jshint.reporter('default'));
});

gulp.task('server', function () {
    livereload.listen();

    var server = gls('bin/devServer.js', {}, false);
    server.start();

    gulp.watch([SRC + '**/*.js', 'gulpfile.js'], ['jshint']);

    gulp.watch(SRC + '**/*.less').on('change', function () {
        gulp.src(SRC + 'app.less')
            .pipe(sourcemaps.init())
            .pipe(less({
                lint: true,
                noIeCompat: true,
                relativeUrls: true
            }))
            .pipe(sourcemaps.write())
            .pipe(livereload());
    });

    gulp.watch([SRC + '**/*.js', SRC + '**/*.html']).on('change', function (evt) {
        gulp.src(evt.path, {
            base: SRC
        }).pipe(livereload());
    });
});

gulp.task('copy', ['clean'], function () {
    return gulp.src(SRC + 'index.html', {
        base: SRC
    }).pipe(gulp.dest(BUILD));
});

gulp.task('build', ['clean'], function () {
    var allFiles = merge(scripts(), styles(), images())
        .pipe(tapDebug('buildList'))
        .pipe(rev())
        .pipe(override())
        .pipe(gulp.dest(BUILD))
        .pipe(tapDebug('build'));

    var revManifest = allFiles
        .pipe(rev.manifest())
        .pipe(tap(function (file) {
            var content = JSON.parse(file.contents.toString());

            Object.keys(content).forEach(function (key) {
                content[key] = CDN + content[key];
            });

            file.contents = new Buffer(JSON.stringify(content, null, 4));
        }));

    var seed = merge(revManifest, gulp.src(SRC + 'seed.js', {
        base: SRC
    }))
        .pipe(tapDebug('revManifest', true))
        .pipe(revCollector())
        .pipe(gulp.dest(BUILD));

    allFiles.pipe((function () {
        var files = [];
        return through2.obj(function (chunk, enc, cb) {
            files.push(CDN + chunk.relative);
            cb();
        }, function (cb) {
            seed.pipe(manifest({
                cache: files,
                timestamp: true
            }))
            .pipe(gulp.dest(BUILD));

            cb();
        });
    }()));
});

gulp.task('clean', function () {
    return gulp.src(BUILD + '**/*.*', {
        read: false
    }).pipe(vinylPaths(del));
});

gulp.task('clearCache', function (done) {
    return fileCache.clearAll(done);
});

gulp.task('default', ['jshint', 'copy', 'build']);

exports.CDN = CDN;
exports.SRC = SRC;
exports.BUILD = BUILD;
