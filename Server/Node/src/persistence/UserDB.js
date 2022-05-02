import dataStore from "nedb-promise";

export class UserDatabase {
  constructor({ filename, autoload }) {
    this.db = dataStore({ filename, autoload });
  }

  async findOne(props) {
    return this.db.findOne(props);
  }

  async insert(user) {
    return this.db.insert(user);
  }
  async clear() {
    return this.db.remove({}, { multi: true });
  }
  async update(props, update) {
    return this.db.update(props, { $set: update });
  }
}

export var userDB = new UserDatabase({
  filename: "./db/users.json",
  autoload: true,
});
