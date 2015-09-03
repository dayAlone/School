var co          = require('co');
var path        = require('path');
var gutil       = require('gulp-util');
var projectRoot = require('config').root;

var loadModels = require('../libs/db/loadModels');

module.exports = function() {

    return co(function*() {

        var args = require('yargs')
        .usage('gulp db:load --from fixture/init')
        .demand(['from'])
        .describe('from', 'file to import')
        .argv;

        var dbPath = path.join(projectRoot, args.from);

        gutil.log('loading db' + dbPath);

        yield* loadModels(dbPath);

        gutil.log('loaded db ' + dbPath);

    }).catch(onerror);

    function onerror(err) {
        console.error(err.stack);
    }
};
