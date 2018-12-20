import axios from "axios";

const URL = "https://www.apifreesoccer.com/api";

export default class FreeSoccerService {
  static async login(user) {
    try {
      let result = await axios.post(URL + "/login", user);
      return result.data;
    } catch (error) {
      return error.response.data;
    }
  }

  static async register(user) {
    try {
      let result = await axios.post(URL + "/register", user);
      return result.data;
    } catch (error) {
      return error.response.data;
    }
  }
}
