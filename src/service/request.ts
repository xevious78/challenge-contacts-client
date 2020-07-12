import axios from "axios";
import Config from "../config";
import urljoin from "url-join";

export const URLJoin = (...args: string[]) =>
  urljoin(Config.backend.baseURL, ...args);

const Request = axios.create({
  baseURL: Config.backend.baseURL,
});

export default Request;
