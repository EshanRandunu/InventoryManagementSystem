import axios from "axios";
import { API_BASE_URL } from "../shared/constants/apiConfig";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default httpClient;
