import axios from "axios";
import instance from "../libs/axios";
import { Product } from "../types";

interface GetProductsResponse {
  data?: Product[];
  error: boolean;
  status: number;
  message: string;
}

interface GetProductResponse {
  data?: Product;
  error: boolean;
  status: number;
  message: string;
}

interface ProductRequest {
  id?: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  min_stock: number;
  stock: number;
}

// Declaramos la función con el tipo de retorno GetProductResponse
export const getProducts = async (): Promise<GetProductsResponse> => {
  try {
    const response = await instance.get("products");
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Productos recuperados",
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

export const createProduct = async (
  product: ProductRequest
): Promise<GetProductResponse> => {
  try {
    const response = await instance.post("products", product);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Producto creado correctamente",
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

export const updateProduct = async (
  product: ProductRequest
): Promise<GetProductResponse> => {
  try {
    const response = await instance.put(`products/${product.id}`, product);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Producto actualizado correctamente",
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

export const deleteProduct = async (product: Product) => {
  try {
    const response = await instance.delete(`products/${product.id}`);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Producto eliminado correctamente",
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
