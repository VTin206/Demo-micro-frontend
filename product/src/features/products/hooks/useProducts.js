import { useEffect, useMemo, useState } from "react";
import {
  addProductToCart,
  getProductCategories,
  getProducts
} from "../services/productService";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastAdded, setLastAdded] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    let isMounted = true;

    getProducts()
      .then((nextProducts) => {
        if (isMounted) {
          setProducts(nextProducts);
          setError(null);
        }
      })
      .catch((nextError) => {
        if (isMounted) {
          setError(nextError);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const addToCart = (product) => {
    const addedProduct = addProductToCart(product);
    setLastAdded(addedProduct.name);
  };

  const categories = useMemo(() => getProductCategories(products), [products]);
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, products, query]);

  const updateQuery = (event) => {
    setQuery(event.target.value);
  };

  const updateCategory = (event) => {
    setCategory(event.target.value);
  };

  return {
    products: filteredProducts,
    categories,
    query,
    category,
    loading,
    error,
    lastAdded,
    addToCart,
    updateQuery,
    updateCategory
  };
}
