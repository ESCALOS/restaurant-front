import { useState, useEffect } from "react";
import { User } from "../types";

export const useUserFilter = (users: User[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEnabled, setShowEnabled] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  useEffect(() => {
    // Almacenamos el timeout para poder limpiarlo si el usuario sigue escribiendo
    const delayDebounce = setTimeout(() => {
      const results = users.filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.document_number.includes(searchQuery);
        return matchesSearch && user.is_enabled === showEnabled;
      });
      setFilteredUsers(results);
    }, 250); // Retraso de 300 ms

    // Limpiar el timeout si el usuario sigue escribiendo o si hay cambios en los otros filtros
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, showEnabled, users]);

  return {
    searchQuery,
    setSearchQuery,
    showEnabled,
    setShowEnabled,
    filteredUsers,
  };
};
