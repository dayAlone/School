
Error.stackTraceLimit = 5;
require('trace');
require('clarify');

var chain = require('stack-chain');

chain.filter.attach(function(error, frames) {
    return frames.filter(function(callSite) {
        var name = callSite && callSite.getFileName();
        return (name && name.indexOf('/co/') === -1);
    });
});
