import fs from 'fs';
const excludes = [
    'index.js'
];
const middlewares = fs.readdirSync(__dirname).filter(file => { return !excludes.includes(file); }).sort();

export default (app) => {
    middlewares.forEach((middleware) => {
        const data = require(`./${middleware}`);
        const use = (func) => {
            if (typeof func === 'function') app.use(func);
        };
        if (typeof data === 'object' && data.length > 0) {
            data.forEach(elem => {
                use(elem);
            });
        } else use(data);
    });
};
