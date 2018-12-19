import axios from "axios";

const URL = "http://localhost:8080/api";

export default class FreeSoccerService {
  static async login(user) {
    try {
      let result = await axios.post(URL + "/login", user);
      return result;
    } catch (error) {
      return error.response.data;
    }
  }

  static async register(user) {
    try {
      let result = await axios.post(URL + "/register", user);
      return result;
    } catch (error) {
      return error.response.data;
    }
  }
}
