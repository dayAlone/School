
// Parse application/json, application/x-www-form-urlencoded
// NOT form/multipart!
var bodyParser = require('koa-bodyparser');
module.exports = bodyParser();
