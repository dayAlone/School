import fs from 'fs';
const excludes = [
    'index.js'
];

export default (app) => {
    const files = fs.readdirSync(__dirname)
        .filter(file => { return !excludes.includes(file); })
        .map(file => { return file.replace('.js', ''); })
        .sort();

    files.forEach(file => {
        require(`./${file}`)(app);
    });

};
