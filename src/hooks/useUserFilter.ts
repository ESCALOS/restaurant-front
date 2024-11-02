import { useState, useEffect } from "react";
import { User } from "../types";

export const useUserFilter = (users: User[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEnabled, setShowEnabled] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  useEffect(() => {
    const results = users.filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch && user.is_enabled === showEnabled;
    });
    setFilteredUsers(results);
  }, [searchQuery, showEnabled, users]);

  return {
    searchQuery,
    setSearchQuery,
    showEnabled,
    setShowEnabled,
    filteredUsers,
  };
};
