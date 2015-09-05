// generate a valid object id from an arbitrary string

var crypto = require('crypto');

// oid('course1') => generates always same id
export default function oid(str) {
    return crypto.createHash('md5').update(str).digest('hex').substring(0, 24);
};

module.exports.withTime = oidWithTime;

function oidWithTime(str) {
    var time = Math.floor(Date.now() / 1000).toString(16);
    while (time.length < 8) { // never happens in real-life though
        time = '0' + time;
    }
    return time + crypto.createHash('md5').update(str).digest('hex').substring(0, 16);
}
