import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  exp: number; // Expiration time
}

export const isTokenExpired = (token: string): boolean => {
  const { exp } = jwtDecode<TokenPayload>(token);
  return Date.now() >= exp * 1000; // Convertir a milisegundos
};
