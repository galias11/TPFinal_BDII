// @Vendors
const MongoClient = require('mongodb');

const createCollection = (client, dataBaseName, collectionName) => (
  client && client.db(dataBaseName).collection(collectionName)
)

const connect = mongoServer => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(mongoServer, (err, client) => { 
      if(err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });
} 

const insert = (client, dataBaseName, collectionName, data) => {
  return new Promise((resolve, reject) => {
    const collection = createCollection(client, dataBaseName, collectionName);
    collection && collection.insertOne(data, (err, results) => {
      if(err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  })
}

const getData = (client, dataBaseName, collectionName, query) => {
  return new Promise((resolve, reject) => {
    const collection = createCollection(client, dataBaseName, collectionName);
    collection && collection.find(query).toArray((err, results) => {
      if(err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

const aggregate = (client, dataBaseName, collectionName, aggregationQuery) => {
  return new Promise((resolve, reject) => {
    const collection = createCollection(client, dataBaseName, collectionName);
    collection && collection.aggregate(aggregationQuery).toArray((err, results) => {
      if(err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

const mapReduce = (client, dataBaseName, collectionName, { mapData, mapReduce, options, aggregationPipeline}) => {
  return new Promise((resolve, reject) => {
    const collection = createCollection(client, dataBaseName, collectionName);
    collection && collection.mapReduce(mapData, mapReduce, options, (err, results) => {
      if(err) {
        reject(err);
      } else {
        if(!aggregationPipeline) {
          resolve(results);
        } else {
          results.aggregate(aggregationPipeline).toArray()
            .then(result => {resolve(result)})
            .catch(err => reject(err));
        }
      }
    });
  })
}

const closeConn = client => {
  client.close(); 
}

module.exports = {
  aggregate,
  closeConn,
  connect,
  getData,
  insert,
  mapReduce
}