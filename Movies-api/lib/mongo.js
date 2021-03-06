const { MongoClient, ObjectId } = require("mongodb");
const { config } = require("../config");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;
const port = encodeURIComponent(config.port);

console.log('user: ' + USER);
console.log('PASSWORD: ' + PASSWORD);
console.log('dbHost: ' + config.dbHost);
console.log('dbPort: ' + config.port);
console.log('DB_NAME: ' + DB_NAME);

const MONGO_URI =  `mongodb+srv://${USER}:${PASSWORD}@${port}:${config.port}/${DB_NAME}?retryWrites=true&w=majority`;
// "mongodb+srv://db_user_platzivideos:${PASSWORD}@cluster0-qjzcu.mongodb.net/test";
  

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
    this.dbName = DB_NAME;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect(err => {
          if (err) {
            reject(err);
          }
          console.log("Connected sucesfully to mongo");
          resolve(this.client.db(this.dbName));
        });
      });
    }

    return MongoLib.connection;
  }

  getAll(collection, query) {
    return this.connect().then(db => {
      return db
            .collection(collection)
            .find(query)
            .toArray();
    });
  }

  get(collection, id) {
    return this.connect().then(db => {
      return db.
             collection(collection).
             findOne({ _id: ObjectId(id) });
    });
  }

  create(collection, data) {
    return this.connect()
      .then(db => {
        return db.
               collection(collection).
               insertOne(data);
      })
      .then(result => result.insertedId);
  }

  update(collection, id, data) {
    return this.connect()
      .then(db => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
      })
      .then(result => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connect()
      .then(db => {
        return db.  
               collection(collection).
               deleteOne({ _id: ObjectId(id) });
      })
      .then(() => id);
  }
}

module.exports = MongoLib;
