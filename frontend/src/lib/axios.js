import axios from "axios";

// You can use `window.location.hostname` to get the current domain/host
const hostIP = window.location.hostname === "localhost" ? "http://localhost:5001" : "https://api.apstor.org";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? `${hostIP}/api` : "/api",
  withCredentials: true,
});

