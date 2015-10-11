// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
var jade = require('jade');
var config = require('config');
var path = require('path');

module.exports = function* (next) {

    var ctx = this;
    /* default helpers*/
    this.locals = ctx.state;

    this.render = function(templatePath, locals) {
        locals = locals || {};
        var localsFull = Object.create(this.locals);

        for (var key in locals) {
            localsFull[key] = locals[key];
        }

        var templatePathResolved = path.join(config.template.root, templatePath + '.jade');

        return jade.renderFile(templatePathResolved, localsFull);
    };

    yield* next;

};
