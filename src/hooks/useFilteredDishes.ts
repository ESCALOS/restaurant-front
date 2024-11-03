import { useState, useMemo } from "react";
import { Dish } from "../types";

type UseFilteredDishesReturn = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredDishes: Dish[];
};

function useFilteredDishes(dishes: Dish[]): UseFilteredDishesReturn {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDishes = useMemo(() => {
    return dishes.filter(
      (dish) =>
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dishes, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredDishes,
  };
}

export default useFilteredDishes;
