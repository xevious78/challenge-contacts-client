import axios from "axios";
import Config from "../config";

const Request = axios.create({
  baseURL: Config.backend.baseURL,
});

export default Request;
