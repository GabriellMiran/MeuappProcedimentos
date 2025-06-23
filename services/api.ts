import axios from "axios";

const api = axios.create({
  baseURL: "http://160.20.22.99:5151/api",
});
/* http://160.20.22.99:5151/api */
export default api;