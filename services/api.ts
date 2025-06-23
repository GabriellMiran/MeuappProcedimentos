import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.5:3000/api",
});
/* http://160.20.22.99:3591/api */
export default api;