import fs from 'fs';
const files = fs.readdirSync(__dirname)
    .filter(file => { return !['index.js'].includes(file); })
    .map(file => { return file.replace('.js', ''); })
    .sort();

const strategies = {};

files.forEach(file => {
    strategies[file] = require(`./${file}`)();
});

export default strategies;
