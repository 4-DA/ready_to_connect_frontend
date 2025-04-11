// src/utils/api.ts
import axios from "axios";

// 1) Base URL: use NEXT_PUBLIC_API_URL or default to local dev
const baseURL =
  (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(
    /\/$/,
    ""
  );

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2) Attach access token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined" && config.headers) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3) Auto‑refresh expired tokens on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // only try once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token stored");

        // Hit DRF refresh endpoint via the same `api` instance
        const { data } = await api.post("/accounts/auth/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = data.access;
        // Save and re‑attach
        localStorage.setItem("access_token", newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Redirect to login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
