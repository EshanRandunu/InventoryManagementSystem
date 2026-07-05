import httpClient from "./httpClient";
import { API_ENDPOINTS } from "../shared/constants/apiConfig";

export const usersApi = {
  getAll: () => httpClient.get(API_ENDPOINTS.users.list),
  getById: (id) => httpClient.get(API_ENDPOINTS.users.byId(id)),
  create: (user) => httpClient.post(API_ENDPOINTS.users.base, user),
  update: (id, user) => httpClient.put(API_ENDPOINTS.users.byId(id), user),
  delete: (id) => httpClient.delete(API_ENDPOINTS.users.byId(id)),
};
