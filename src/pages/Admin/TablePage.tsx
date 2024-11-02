import { useAuthStore } from "../../store/authStore";

function TablePage() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  return (
    <div>
      <h1>Table Page</h1>
      {user?.username} - {user?.role}
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}

export default TablePage;
