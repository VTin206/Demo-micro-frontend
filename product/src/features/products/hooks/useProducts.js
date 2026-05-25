import { useEffect, useState } from "react";
import { getProducts } from "../services/productApi";

export function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return { products };
}
