// /src/utils/api.ts
import axios from "axios";

// You can use an environment variable for the API base URL
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL, // e.g., http://127.0.0.1:8000/api
  withCredentials: true, // Include credentials (cookies, etc.) if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// You can also add interceptors for requests or responses if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle errors globally here
    return Promise.reject(error);
  }
);

export default api;
