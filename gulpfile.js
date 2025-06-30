const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gzip = require('gulp-gzip');

//js文件打包
gulp.task('jsmin', (done) => {
    gulp.src('src/*.js')
        //.pipe(babel()) //ES6转换为ES5
        .pipe(uglify())
        .pipe(gulp.dest('build/'))
    done()
})

//js文件打包
gulp.task('jsgzmin', (done) => {
  gulp.src('src/*.js')
      //.pipe(babel()) //ES6转换为ES5
      .pipe(uglify())
      .pipe(gzip())
      .pipe(gulp.dest('build/'))
  done()
})

// //开启一个任务
gulp.task('default', gulp.series('jsmin','jsgzmin'))
gulp.task('watch', () => {
    gulp.watch('src/*.*', gulp.series('default'))
})
