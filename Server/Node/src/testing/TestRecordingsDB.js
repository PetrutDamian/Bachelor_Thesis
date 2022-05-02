import { Recording } from "../model/Recording";
import { RecordingsDB } from "../persistence/RecordingsDB";
import { RecordingsService } from "../service/RecordingsService";

class RecordingsDbTestRunner {
  constructor(filename) {
    this.db = new RecordingsDB({ filename: filename, autoload: true });
    this.service = new RecordingsService(this.db);
  }
  async unitTestCrudOperations() {
    const recording = new Recording(new Date(2020, 1, 1), "ripe", "1234");
    const recording2 = new Recording(new Date(2020, 1, 1), "unripe", "4321");
    try {
      await this.db.saveUserRecording(recording);
      await this.db.saveUserRecording(recording2);
      const recordings_user1 = await this.db.getUserRecordings("1234");
      console.assert(recordings_user1.length === 1);
      console.assert(recordings_user1[0].date === recording.date);
      console.assert(recordings_user1[0].ripeness === recording.ripeness);
      console.assert(recordings_user1[0].userId === recording.userId);

      const recordings_user2 = await this.db.getUserRecordings("4321");
      console.assert(recordings_user2.length === 1);
      console.assert(recordings_user2[0].date === recording2.date);
      console.assert(recordings_user2[0].ripeness === recording2.ripeness);
      console.assert(recordings_user2[0].userId === recording2.userId);
    } catch (err) {
      console.log("Error");
    } finally {
      await this.db.clear();
    }
  }
  async integrationTestGetRecordingsHistory() {
    const date = new Date();
    const r = await this.db.saveUserRecording(
      new Recording(date, "ripe", 1234)
    );
    await this.db.saveUserRecording(new Recording(date, "unripe", 1234));
    try {
      const recordings1 = await this.service.getRecordingsHistory(1234);
      console.assert(recordings1.length === 2, "Length is not 2!");
      console.assert(recordings1[0].date === date, "Wrong date 1");
      console.assert(recordings1[1].date === date, "Wrong date 2");
      console.assert(
        (recordings1[0].ripeness === "ripe" &&
          recordings1[1].ripeness === "unripe") ||
          (recordings1[0].ripeness === "unripe" &&
            recordings1[1].ripeness === "ripe"),
        "Ripeness is wrong"
      );
      const recordings2 = await this.service.getRecordingsHistory(4321);
      console.assert(recordings2.length === 0, "Length is not 0");
    } catch (error) {
      console.assert(false, "Error thrown!");
    } finally {
      await this.db.clear();
    }
  }
  async test() {
    await this.unitTestCrudOperations();
    await this.integrationTestGetRecordingsHistory();
  }
}
export const recordingsDbTestRunner = new RecordingsDbTestRunner(
  "./db/test-recordings.json"
);
