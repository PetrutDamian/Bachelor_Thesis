import axios from "axios";
const url = "http://127.0.0.1:5000/";
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};
export class AIModule {
  async submitWatermelon(path) {
    return axios.post(url, { path }, config);
  }
}

export var RipenessClassifier = new AIModule();
