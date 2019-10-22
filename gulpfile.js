var gulp = require('gulp');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var mocha = require('gulp-mocha');
var todo = require('gulp-todo');
var webpack = require('webpack-stream');
var request = require('sync-request');
var fs = require('fs');
//var browserify = require('browserify');
//gulp.task('build', ['build-client', 'build-server', 'test', 'todo']);
var shell = require('gulp-shell');
var concat = require('gulp-concat');
var less = require('gulp-less');
var path = require('path');
 
gulp.task('less', function () {
  return gulp.src('dev/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('dev/css/'));
});

gulp.task('styles', ['less'], function(){

  return gulp.src('dev/css/*.css')
  .pipe(concat('main.css'))
  .pipe(gulp.dest('cdn/public/css/'));

});

gulp.task('build', ['build-client', 'build-server'], function(){
  console.log("BUILD DONE");
});


gulp.task('seed', shell.task([
'sequelize db:seed:all'
  ]));


//gulp.task('test', ['lint'], function () {
 //   gulp.src(['test/**/*.js'])
 //       .pipe(mocha());
//});

gulp.task('lint', function () {
  return gulp.src(['**/*.js', '!node_modules/**/*.js', '!bin/**/*.js'])
   .pipe(jshint({
         esnext: true
     }))
   .pipe(jshint.reporter('default', { verbose: true}))
   .pipe(jshint.reporter('fail'));
});

gulp.task('move-js-libs', function(){

return gulp.src('dev/libs/*.js')
      .pipe(concat('libs.js'))
      .pipe(gulp.dest('cdn/public/js/libs/'));
});

//gulp.task('build-client', ['lint', 'move-client'], function () {
gulp.task('build-client', [], function () {
  console.log("BUILDING-CLIENT");
  return gulp.src(['dev/js/*.js'])
    .pipe(uglify())
    .pipe(webpack(require('./webpack.config.js')))
    // b = browserify('dev/js/*.js', {debug: true});
    //return b.bundle()
    //.pipe(babel({presets: ['es2015']}))
    //.pipe(babel())
    .pipe(gulp.dest('cdn/public/js/'));
});

//gulp.task('move-client', function () {
 // return gulp.src(['public/js/**/*.*', '!public/js/*.js'])
 //   .pipe(gulp.dest('./public/js/'));
//});


//gulp.task('build-server', ['lint'], function () {
gulp.task('build-server', [], function () {
console.log('BUILDING-SERVER');    
  return gulp.src(['api/*.js'])
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('./'));
});


//gulp.task('compile', function(){
 //return gulp.start('build');
//}//);



//gulp.task('watch', ['build'], function () {
  //gulp.watch('./*.js');
 // gulp.watch(['dev/*.*'], ['build-client']);
 // gulp.watch(['api/*.*'], ['build-server']);
 // gulp.start('run');
//});


//gulp.task('todo', ['lint'], function() {
  //gulp.src('/**/*.js')
  //    .pipe(todo())
  //    .pipe(gulp.dest('./'));
//});

gulp.task('debug', ['build'], function () {
  //  gulp.task('run', [], function () {
   nodemon({
      delay: 100,
      script: 'server.js',
      nodeArgs: ['--debug'],
         watch: ['dev','api'],
      ignore: ['node_modules'],
      tasks: ['build']


      // cwd: "./bin/",
       // args: ["config.json"],
       //ext: 'html js css'
    }).on('restart',  function () {
        console.log('server restarted!');
  });

});



gulp.task('run', ['build'], function () {
  //  gulp.task('run', [], function () {
   nodemon({
      delay: 100,
      script: 'server.js',
         watch: ['dev','api'],
      ignore: ['node_modules'],
      tasks: ['build']


      // cwd: "./bin/",
       // args: ["config.json"],
       //ext: 'html js css'
    }).on('restart',  function () {
        console.log('server restarted!');
  }).on('start', function(){
    //gulp.start('seed');
  });

});

gulp.task('run-front', ['build-client'], function () {
  //  gulp.task('run', [], function () {
   nodemon({
      delay: 100,
      script: 'server.js',
         watch: ['dev'],
      ignore: ['node_modules'],
      tasks: ['build-client']


      // cwd: "./bin/",
       // args: ["config.json"],
       //ext: 'html js css'
    }).on('restart',  function () {
        console.log('server restarted!');
  }).on('start', function(){
   // gulp.start('seed');
  });

});

gulp.task('run-only', function () {
    
   nodemon({
      delay: 100,
      script: 'server.js',
      watch: ['dev','api'],
      ignore: ['node_modules'],
      tasks: ['build']
      // cwd: "./bin/",
       // args: ["config.json"],
      // ext: 'html js css'
    }).on('restart', ['build'], function () {
        console.log('server restarted!');
  }).on('start', function(){
    //gulp.start('seed');
  });

  //  nodemon({
    //    delay: 10,
     //   script: './server.js',
     //   cwd: "./bin/",
     //   args: ["config.json"],
    //    ext: 'html js css'
    //})
    //.on('restart', function () {
    //    util.log('server restarted!');
    //});
});



gulp.task('default', ['run']);
