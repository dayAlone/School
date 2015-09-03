// in-memory store by default (use the right module instead)
const mongoose = require('mongoose');
const session = require('koa-generic-session');
const mongooseStore = require('koa-session-mongoose');

module.exports = session({
    store: mongooseStore.create({
        model:   'Session'
    })
});
