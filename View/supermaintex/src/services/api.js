import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // tu backend
});

export default API;
