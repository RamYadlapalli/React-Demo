"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var browserify = require("browserify");
var reactify =require("reactify");
var source =require("vinyl-source-stream");
var concat = require("gulp-concat");

var config ={
    port: 9005,
    devBaseURL: 'http://localhost',
    paths:{
        html: './src/*.html',
        js: './src/*.js',
        server: './app',
        mainJS:"./src/main.js",
        css:['./src/component1.css','./src/component2.css']
    },
    homePage: 'home.html'
}

gulp.task("connectServer",function(){
    connect.server({
        root:['app'],
        port:config.port,
        baseURL:config.devBaseURL,
        livereload: true
    });
});

gulp.task("open",['connectServer'], function(){
    gulp.src('app/home.html')
    .pipe(
        open({
        uri:config.devBaseURL+":"+config.port+'/'+ config.homePage}));
    });


gulp.task("copyHtml",function(){
    gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.server))
    .pipe(connect.reload());
});

gulp.task("js",function(){
    browserify(config.paths.mainJS)
   .transform(reactify)
    .bundle()
    .on('error',console.error.bind(console))
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(config.paths.server+"/scripts"))
    .pipe(connect.reload());
});

gulp.task("css",function(){
gulp.src(config.paths.css)
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(config.paths.server+"/css"));
});

gulp.task("watch",function(){
    gulp.watch(config.paths.html, ["copyHtml"]);
     gulp.watch(config.paths.html, ["js"]);
      gulp.watch(config.paths.html, ["css"]);
});

gulp.task("default",["copyHtml", "js","css","open","watch"]);

