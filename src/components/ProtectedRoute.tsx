// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { isTokenExpired } from "../utils/tokenUtils";

interface Props {
  isAllowed: boolean;
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ isAllowed, children }: Props) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  // Verificar si el token está expirado
  if (user?.token && isTokenExpired(user.token)) {
    // Si el token está expirado, redirigir a login o mostrar un mensaje
    return <Navigate to="/login" />;
  }

  // Si no está permitido, redirigir a forbidden
  if (!isAllowed) return <Navigate to="/forbidden" />;

  return children ?? <Outlet />;
};
