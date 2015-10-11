import passport from 'koa-passport';
import fs from 'fs';
const files = fs.readdirSync(__dirname)
    .filter(file => { return !['index.js'].includes(file); })
    .map(file => { return file.replace('.js', ''); })
    .sort();

const strategies = {};

files.forEach(file => {
    passport.use(require(`./${file}`));

});

export default strategies;
