import { Recording } from "../model/Recording";
import { RecordingsDatabase } from "../persistence/RecordingsDB";
import { RipenessClassifier } from "../watermelon_service/Remote";
export class RecordingsService {
  constructor(recordingsDb) {
    this.recordingsDb = recordingsDb;
  }

  async getRecordingsHistory(userId) {
    const recordings = await this.recordingsDb.getUserRecordings(userId);
    recordings.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    return recordings;
  }
  async submitRecording(temp_path, name, userId) {
    const newPath = `recordings/${userId}/${name}`;
    this.recordingsDb.saveRecordingFile(temp_path, newPath);
    const result = await RipenessClassifier.submitWatermelon(newPath);
    const recording = new Recording(new Date(), result.data, userId);
    this.recordingsDb.saveUserRecording(recording);
    return result.data;
  }
}
export var recordingsService = new RecordingsService(RecordingsDatabase);
