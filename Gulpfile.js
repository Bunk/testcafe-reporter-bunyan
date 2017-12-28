var gulp = require('gulp')
var standard = require('gulp-standard')
var babel = require('gulp-babel')
var mocha = require('gulp-mocha')
var bump = require('gulp-bump')
var git = require('gulp-git')
var tagVersion = require('gulp-tag-version')
var filter = require('gulp-filter')
var del = require('del')

gulp.task('clean', function (cb) {
  del('lib', cb)
})

function inc (importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json', './bower.json'])
      // bump the version number in those files
      .pipe(bump({type: importance}))
      // save it back to filesystem
      .pipe(gulp.dest('./'))
      // commit the changed version number
      .pipe(git.commit('bumps package version'))

      // read only one file to get the version number
      .pipe(filter('package.json'))
      // **tag it in the repository**
      .pipe(tagVersion())
}

gulp.task('patch', function () { return inc('patch') })
gulp.task('feature', function () { return inc('minor') })
gulp.task('release', function () { return inc('major') })

gulp.task('lint', function () {
  return gulp
        .src([
          'src/**/*.js',
          'test/**/*.js',
          'Gulpfile.js'
        ])
        .pipe(standard())
        .pipe(standard.reporter('default', {
          breakOnError: true,
          quiet: true
        }))
})

gulp.task('build', ['clean', 'lint'], function () {
  return gulp
        .src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('lib'))
})

gulp.task('test', ['build'], function () {
  return gulp
        .src('test/**.js')
        .pipe(mocha({
          ui: 'bdd',
          reporter: 'spec',
          timeout: typeof v8debug === 'undefined' ? 2000 : Infinity // NOTE: disable timeouts in debug
        }))
})

gulp.task('preview', ['build'], function () {
  var buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin
  var pluginFactory = require('./lib')
  var reporterTestCalls = require('./test/utils/reporter-test-calls')
  var plugin = buildReporterPlugin(pluginFactory)

  console.log()

  reporterTestCalls.forEach(function (call) {
    plugin[call.method].apply(plugin, call.args)
  })

  process.exit(0)
})
