var MongoClient = require('mongodb').MongoClient;

class Database {
  constructor(url, db) {
    this.url = url;
    this.db = db;
  }
  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.url || 'mongodb://localhost:27017', {
        useNewUrlParser: true
      }).then(client => {
        this.db = client.db(this.db || 'welcome-wagon');
        this.users = this.db.collection('signups');
        resolve(this.db);
      });
    });
  }
  addUser(user) {
    return this.users.insertOne(user);
  }
}

module.exports = Database;
