// @Constants
const { DB_SERVER } = require('../constants/constants');

// @Messages 
const { CONNECTION_NOT_READY } = require('../constants/messages');

// @Helpers
const {
  closeConn,
  connect,
  getData,
  insert,
  mapReduce
} = require('../helpers/dbHelper');

class DBClient {
  constructor() {
    this.ready = false;
    this.close = this.close.bind(this);
    this.connect = this.connect.bind(this);
    this.insertData = this.insertData.bind(this);
    this.isReady = this.isReady.bind(this);
    this.getData = this.getData.bind(this);
    this.reConnect = this.reConnect.bind(this);
    this.mapReduce = this.mapReduce.bind(this);
  }

  connect(onConnectCallback) {
    if(this.ready) {
      return;
    }
    connect(DB_SERVER)
      .then(client => {
        this.ready = true;
        this.client = client;
        onConnectCallback && onConnectCallback(false, this);
      })
      .catch(err => {
        this.ready = false;
        onConnectCallback && onConnectCallback(err, this);
      });
  }

  isReady() {
    return this.ready;
  }

  reConnect(onConnectCallback) {
    this.close();
    this.connect(onConnectCallback);
  }

  close(onCloseConnCallback) {
    if(this.ready) {
      closeConn(this.client);
      this.ready = false;
      onCloseConnCallback && onCloseConnCallback();
    }
  }

  getData(dbName, collectionName, query) {
    if(!this.ready) {
      return Promise.reject(CONNECTION_NOT_READY);
    }
    return getData(this.client, dbName, collectionName, query);
  }

  insertData(dbName, collectionName, data) {
    if(!this.ready) {
      return Promise.reject(CONNECTION_NOT_READY);
    }
    const timedData = {...data, storeTime: (new Date()).getTime()};
    return insert(this.client, dbName, collectionName, timedData);
  }

  mapReduce(dbName, collectionName, mapReduceParameters) {
    if(!this.ready) {
      return Promise.reject(CONNECTION_NOT_READY);
    }
    return mapReduce(this.client, dbName, collectionName, mapReduceParameters);
  }
}

module.exports = DBClient;