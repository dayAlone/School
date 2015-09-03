require('babel/register');
require('./server/libs/trace');
const gulp = require('gulp');
const gp = require('gulp-load-plugins')();

const mongoose = require('./server/libs/mongoose');

process.on('uncaughtException', function(err) {
    console.error(err.message, err.stack, err.errors);
    process.exit(255);
});

gulp.task('nodemon', function() {
    gp.nodemon({
        nodeArgs: ['--debug'],
        script:   'index.js'
        /* watch, ignore */
    });
});

gulp.task('db:load', require('./server/tasks/dbLoad'));

// when queue finished successfully or aborted, close db
// orchestrator events (sic!)
gulp.on('stop', function() {
    mongoose.disconnect();
});

gulp.on('err', function(gulpErr) {
    if (gulpErr.err) {
        // cause
        console.error('Gulp error details', [gulpErr.err.message, gulpErr.err.stack, gulpErr.err.errors].filter(Boolean));
    }
    mongoose.disconnect();
});
