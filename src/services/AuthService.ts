import axios from "axios";
import instance from "../libs/axios";

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const response = await instance.post("auth/login", { username, password });
    return { data: response.data, error: false };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: true,
        message: error.response?.data?.message || "Error de autenticación",
        status: error.response?.status || 500,
      };
    }
    return { error: true, message: "Error desconocido", status: 500 };
  }
};
