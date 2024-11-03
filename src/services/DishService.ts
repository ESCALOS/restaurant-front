import axios from "axios";
import instance from "../libs/axios";
import { Dish } from "../types";

interface GetDishesResponse {
  data?: Dish[];
  error: boolean;
  status: number;
  message: string;
}

interface GetDishResponse {
  data?: Dish;
  error: boolean;
  status: number;
  message: string;
}

interface DishRequest {
  id?: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
}

// Declaramos la función con el tipo de retorno GetDishResponse
export const getDishes = async (): Promise<GetDishesResponse> => {
  try {
    const response = await instance.get("dishes");
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Dishes recuperados",
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

export const createDish = async (
  dish: DishRequest
): Promise<GetDishResponse> => {
  try {
    const response = await instance.post("dishes", dish);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Dish creado correctamente",
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

export const updateDish = async (
  dish: DishRequest
): Promise<GetDishResponse> => {
  try {
    const response = await instance.put(`dishes/${dish.id}`, dish);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Dish actualizado correctamente",
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

export const deleteDish = async (dish: Dish) => {
  try {
    const response = await instance.delete(`dishes/${dish.id}`);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Dish eliminado correctamente",
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
