import { useEffect, useState } from "react";
import * as productService from "../services/productService";

export function useProducts({ category } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const fetcher = category ? productService.getProductsByCategory(category) : productService.getAllProducts();
    fetcher.then((data) => {
      if (active) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [category]);

  return { products, loading };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    productService.getProductById(id).then((data) => {
      if (active) {
        setProduct(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

  return { product, loading };
}
