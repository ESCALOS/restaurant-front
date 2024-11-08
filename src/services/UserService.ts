// services/authService.ts
import axios from "axios";
import instance from "../libs/axios";
import { User } from "../types";

// Definimos el tipo de respuesta para la función getUsers
interface GetUsersResponse {
  data?: User[];
  error: boolean;
  status: number;
  message: string;
}

interface GetUserResponse {
  data?: User;
  error: boolean;
  status: number;
  message: string;
}

interface UserRequest {
  id?: number;
  username: string;
  document_number: string;
  document_type: string;
  name: string;
  phone: string;
  role: string;
}

// Declaramos la función con el tipo de retorno GetUserResponse
export const getUsers = async (): Promise<GetUsersResponse> => {
  try {
    const response = await instance.get("users");
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Usuarios recuperados",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: true,
        message: error.response?.data?.message || "Error de autenticación",
        status: error.response?.status || 500,
      };
    }
    return {
      error: true,
      message: "Error desconocido",
      status: 500,
    };
  }
};

export const createUser = async (
  user: UserRequest
): Promise<GetUserResponse> => {
  try {
    const response = await instance.post("users", user);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Usuario creado correctamente",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: true,
        message: error.response?.data?.message || "Error de autenticación",
        status: error.response?.status || 500,
      };
    }
    return {
      error: true,
      message: "Error desconocido",
      status: 500,
    };
  }
};

export const updateUser = async (
  user: UserRequest
): Promise<GetUserResponse> => {
  try {
    const response = await instance.put(`users/${user.id}`, user);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Usuario actualizado correctamente",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: true,
        message: error.response?.data?.message || "Error de autenticación",
        status: error.response?.status || 500,
      };
    }
    return {
      error: true,
      message: "Error desconocido",
      status: 500,
    };
  }
};

export const toggleUser = async (user: User) => {
  try {
    const response = await instance.patch(
      `users/${user.id}/enabled`,
      {},
      { params: { isEnabled: !user.is_enabled } }
    );
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Usuario habilitado/deshabilitado correctamente",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: true,
        message: error.response?.data?.message || "Error de autenticación",
        status: error.response?.status || 500,
      };
    }
    return {
      error: true,
      message: "Error desconocido",
      status: 500,
    };
  }
};
