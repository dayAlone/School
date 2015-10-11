var mongoose = require('mongoose');

// tried using pow-mongoose-fixtures,
// but it fails with capped collections, it calls remove() on them => everything dies
// so rolling my own tiny-loader
module.exports = function* (data) {
    var modelsData = (typeof data === 'string') ? require(data) : data;

    for (var modelName in modelsData) {
        var Model = mongoose.models[modelName];
        yield Model.remove({});
        yield* loadModel(Model, modelsData[modelName]);
    }
};

// load data into the DB, replace if _id is the same
function *loadModel(Model, data) {

    for (var i = 0; i < data.length; i++) {
        yield Model.create(data[i]);
    }

}
