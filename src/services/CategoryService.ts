import axios from "axios";
import instance from "../libs/axios";
import { Category } from "../types";

interface GetCategoriesResponse {
  data?: Category[];
  error: boolean;
  status: number;
  message: string;
}

interface GetCategoryResponse {
  data?: Category;
  error: boolean;
  status: number;
  message: string;
}

interface CategoryRequest {
  id?: number;
  name: string;
}

// Declaramos la función con el tipo de retorno GetCategoryResponse
export const getCategories = async (): Promise<GetCategoriesResponse> => {
  try {
    const response = await instance.get("categories");
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Categorías recuperadas",
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

export const createCategory = async (
  category: CategoryRequest
): Promise<GetCategoryResponse> => {
  try {
    const response = await instance.post("categories", category);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Categoría creada correctamente",
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

export const updateCategory = async (
  category: CategoryRequest
): Promise<GetCategoryResponse> => {
  try {
    const response = await instance.put(`categories/${category.id}`, category);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Categoría actualizada correctamente",
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

export const deleteCategory = async (category: Category) => {
  try {
    const response = await instance.delete(`categories/${category.id}`);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Categoría eliminada correctamente",
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
