import { authentificationTestRunner } from "./TestAuthentification";
import { recordingsDbTestRunner } from "./TestRecordingsDB";
class TestRunner {
  constructor() {}
  async _runUserDBTest() {
    console.log("user authentification tests started");
    await authentificationTestRunner.test();
    console.log("user authentification tests ended");
  }
  async _runRecordingsDBTest() {
    console.log("recordingsDB test started");
    await recordingsDbTestRunner.test();
    console.log("recordingsDB test ended");
  }
  runTests() {
    this._runUserDBTest();
    this._runRecordingsDBTest();
  }
}
export const testRunner = new TestRunner();
