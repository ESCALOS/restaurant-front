import axios from "axios";
import { useAuthStore } from "../store/authStore";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default instance;
