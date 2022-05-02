import dataStore from "nedb-promise";
const fs = require("fs");

export class RecordingsDB {
  constructor({ filename, autoload }) {
    this.db = dataStore({ filename, autoload, inMemoryOnly: false });
  }
  createRecordingsDirectory(name) {
    fs.mkdirSync(name);
  }
  saveRecordingFile(temp_path, path) {
    fs.copyFileSync(temp_path, path);
  }
  async saveUserRecording(recording) {
    const result = await this.db.insert(recording);
    return Promise.resolve(result);
  }
  async getUserRecordings(userId) {
    return this.db.find({ userId: userId });
  }
  async clear() {
    this.db.remove({}, { multi: true });
  }
}

export var RecordingsDatabase = new RecordingsDB({
  filename: "./db/recordings.json",
  autoload: true,
});
