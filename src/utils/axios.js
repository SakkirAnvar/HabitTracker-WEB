import axios from "axios";
import { VITE_API_URL } from "./constants";

const api = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
});

export default api;
