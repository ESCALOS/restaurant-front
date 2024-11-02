import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "sonner";
import LoginPage from "./pages/LoginPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";
import { isTokenExpired } from "./utils/tokenUtils";
import Layout from "./layouts/Layout";

// Lazy load de las páginas
const DashboardPage = lazy(() => import("./pages/Admin/DashboardPage"));
const UsersPage = lazy(() => import("./pages/Admin/UserPage"));
const TableAdminPage = lazy(() => import("./pages/Admin/TablePage"));
const CategoryPage = lazy(() => import("./pages/Admin/CategoryPage"));
const ProductsPage = lazy(() => import("./pages/Admin/ProductPage"));
const DishesPage = lazy(() => import("./pages/Admin/DishPage"));
const ReportPage = lazy(() => import("./pages/Admin/ReportPage"));
const TableWaiterPage = lazy(() => import("./pages/Waiter/TablePage"));

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user && isTokenExpired(user.token)) {
      logout();
    }
  }, [user, logout]);

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === "ROLE_ADMIN" ? "/" : "/waiter"} />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          element={
            <ProtectedRoute
              isAllowed={isAuthenticated && user?.role === "ROLE_ADMIN"}
            />
          }
        >
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/usuarios"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <UsersPage />
                </Suspense>
              }
            />
            <Route
              path="/mesas"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <TableAdminPage />
                </Suspense>
              }
            />
            <Route
              path="/categorias"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <CategoryPage />
                </Suspense>
              }
            />
            <Route
              path="/productos"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ProductsPage />
                </Suspense>
              }
            />
            <Route
              path="/platos"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <DishesPage />
                </Suspense>
              }
            />
            <Route
              path="/reportes"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ReportPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
        <Route
          element={
            <ProtectedRoute
              isAllowed={isAuthenticated && user?.role === "ROLE_WAITER"}
            />
          }
        >
          <Route
            path="/waiter"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <TableWaiterPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
