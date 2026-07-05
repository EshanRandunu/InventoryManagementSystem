import httpClient from "./httpClient";
import { API_ENDPOINTS } from "../shared/constants/apiConfig";

export const authApi = {
  login: ({ email, password }) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    return httpClient.post(API_ENDPOINTS.auth.login, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },
};
