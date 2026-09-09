import seedProducts from "../data/products.mock.json";
import { readStorage, writeStorage } from "./storage";

const KEY = "products";

function seedIfEmpty() {
  const existing = readStorage(KEY, null);
  if (!existing) {
    writeStorage(KEY, seedProducts);
    return seedProducts;
  }
  return existing;
}

/**
 * Every export here returns a Promise so a future real API layer
 * (fetch/axios against a backend) can replace the internals without
 * any calling component needing to change.
 */

export async function getAllProducts() {
  return seedIfEmpty();
}

export async function getProductById(id) {
  const products = seedIfEmpty();
  return products.find((p) => p.id === id) ?? null;
}

export async function getProductsByCategory(category) {
  const products = seedIfEmpty();
  if (!category || category === "All") return products;
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export async function searchProducts(query) {
  const products = seedIfEmpty();
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
  );
}

export async function getFeaturedProducts() {
  const products = seedIfEmpty();
  return products.filter((p) => p.isFeatured);
}

export async function getRelatedProducts(product, limit = 4) {
  const products = seedIfEmpty();
  return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}

export async function createProduct(product) {
  const products = seedIfEmpty();
  const id = `p${String(Date.now()).slice(-6)}`;
  const newProduct = { ...product, id, rating: 0, reviewCount: 0 };
  const next = [...products, newProduct];
  writeStorage(KEY, next);
  return newProduct;
}

export async function updateProduct(id, updates) {
  const products = seedIfEmpty();
  const next = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
  writeStorage(KEY, next);
  return next.find((p) => p.id === id);
}

export async function deleteProduct(id) {
  const products = seedIfEmpty();
  const next = products.filter((p) => p.id !== id);
  writeStorage(KEY, next);
  return true;
}
