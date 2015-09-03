import fs from 'fs';
const files = fs.readdirSync(__dirname)
    .filter(file => { return !['index.js'].includes(file); })
    .map(file => { return file.replace('.js', ''); })
    .sort();

const models = {};

files.forEach(file => {
    models[file.charAt(0).toUpperCase()] = require(`./${file}`)();
});

export default function() {
    return models;
};
