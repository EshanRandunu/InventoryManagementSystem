export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  auth: {
    login: "/login",
  },
  inventory: {
    base: "/inventory",
    byId: (id) => `/inventory/${id}`,
    imageUpload: "/inventory/itemImg",
    image: (filename) => `/uploads/${filename}`,
  },
  users: {
    list: "/users",
    base: "/user",
    byId: (id) => `/user/${id}`,
  },
};
