// services/authService.ts
import axios from "axios";
import instance from "../libs/axios";
import { Table } from "../types";

// Definimos el tipo de respuesta para la función getTables
interface GetTablesResponse {
  data?: Table[];
  error: boolean;
  status: number;
  message: string;
}

interface GetTableResponse {
  data?: Table;
  error: boolean;
  status: number;
  message: string;
}

interface TableRequest {
  id?: number;
  number: string;
}

// Declaramos la función con el tipo de retorno GetTableResponse
export const getTables = async (): Promise<GetTablesResponse> => {
  try {
    const response = await instance.get("tables");
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Tablas recuperadas",
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

export const createTable = async (
  table: TableRequest
): Promise<GetTableResponse> => {
  try {
    const response = await instance.post("tables", table);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Tabla creada correctamente",
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

export const updateTable = async (
  table: TableRequest
): Promise<GetTableResponse> => {
  try {
    const response = await instance.put(`tables/${table.id}`, table);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Tabla actualizada correctamente",
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

export const deleteTable = async (table: Table) => {
  try {
    const response = await instance.delete(`tables/${table.id}`);
    return {
      data: response.data,
      error: false,
      status: 200,
      message: "Mesa eliminada correctamente",
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
