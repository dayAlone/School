var mongoose = require('mongoose');
var log = require('log')();
var co = require('co');
var thunkify = require('thunkify');

module.exports = function*() {

  var db;

  if (mongoose.connection.readyState == 1) { // connected
    db = mongoose.connection.db;
  } else {
    db = yield thunkify(mongoose.connection.on)('open');
  }

  yield* clearDatabase(db);

  yield* ensureIndexes();

  yield* ensureCapped();

};

function *clearDatabase(db) {

  var collections = yield new Promise(function(resolve, reject) {
    db.listCollections().toArray(function(err, items) {
      if (err) return reject(err);
      resolve(items);
    });
  });

  var collectionNames = collections
    .map(function(collection) {
      //console.log(collection.name);
      //var collectionName = collection.name.slice(db.databaseName.length + 1);
      if (collection.name.indexOf('system.') === 0) {
        return null;
      }
      return collection.name;
    })
    .filter(Boolean);

  yield collectionNames.map(function(name) {
    return thunkify(db.dropCollection)(name);
  });

}



// wait till indexes are complete, especially unique
// required to throw errors
function *ensureIndexes(db) {

  yield mongoose.modelNames().map(function(modelName) {
    var model = mongoose.models[modelName];
    return thunkify(model.ensureIndexes.bind(model))();
  });

}


// ensure that capped collections are actually capped
function *ensureCapped(db) {

  yield mongoose.modelNames().map(function(modelName) {
    var model = mongoose.models[modelName];
    var schema = model.schema;
    if (!schema.options.capped) return;

    return thunkify(db.command)({convertToCapped: model.collection.name, size: schema.options.capped});
  });
}

