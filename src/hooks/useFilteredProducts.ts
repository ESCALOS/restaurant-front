import { useState, useMemo } from "react";
import { Product } from "../types";

type UseFilteredProductsReturn = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  showLowStock: boolean;
  setShowLowStock: React.Dispatch<React.SetStateAction<boolean>>;
  filteredProducts: Product[];
};

function useFilteredProducts(products: Product[]): UseFilteredProductsReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearchQuery =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLowStock = showLowStock
        ? product.stock < product.min_stock
        : true;

      return matchesSearchQuery && matchesLowStock;
    });
  }, [products, searchQuery, showLowStock]);

  return {
    searchQuery,
    setSearchQuery,
    showLowStock,
    setShowLowStock,
    filteredProducts,
  };
}

export default useFilteredProducts;
