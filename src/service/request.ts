import axios from "axios";

const Request = axios.create({
  baseURL: "https://localhost:3000/",
});

export default Request;
