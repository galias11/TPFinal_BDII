// @Vendors
const MongoClient = require('mongodb');

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
    const collection = client && client.db(dataBaseName).collection(collectionName);
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
    const collection = client && client.db(dataBaseName).collection(collectionName);
    collection && collection.find(query).toArray((err, results) => {
      if(err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

const mapReduce = (client, dataBaseName, collectionName, { mapData, mapReduce, options, aggregationQuery}) => {
  return new Promise((resolve, reject) => {
    const collection = client && client.db(dataBaseName).collection(collectionName);
    collection && collection.mapReduce(mapData, mapReduce, options, (err, results) => {
      if(err) {
        reject(err);
      } else {
        if(!aggregationQuery) {
          resolve(results);
        } else {
          results.aggregate(aggregationQuery).toArray()
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
  closeConn,
  connect,
  getData,
  insert,
  mapReduce
}