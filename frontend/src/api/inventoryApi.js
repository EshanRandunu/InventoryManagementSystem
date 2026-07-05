import httpClient from "./httpClient";
import { API_BASE_URL, API_ENDPOINTS } from "../shared/constants/apiConfig";

export const inventoryApi = {
  getAll: () => httpClient.get(API_ENDPOINTS.inventory.base),
  getById: (id) => httpClient.get(API_ENDPOINTS.inventory.byId(id)),
  create: (item) => httpClient.post(API_ENDPOINTS.inventory.base, item),
  update: (id, formData) =>
    httpClient.put(API_ENDPOINTS.inventory.byId(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => httpClient.delete(API_ENDPOINTS.inventory.byId(id)),
  uploadImage: (formData) =>
    httpClient.post(API_ENDPOINTS.inventory.imageUpload, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getImageUrl: (filename) =>
    filename ? `${API_BASE_URL}${API_ENDPOINTS.inventory.image(filename)}` : "",
};
