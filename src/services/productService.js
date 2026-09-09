import { supabase } from "../lib/supabaseClient";

function mapProductRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    rating: Number(row.rating) || 0,
    reviewCount: row.review_count ?? 0,
    isNew: row.is_new,
    isFeatured: row.is_featured,
    stock: row.stock ?? 0,
    description: row.description ?? "",
    details: row.details ?? [],
    image: row.image ?? null,
  };
}

function toRow(product) {
  return {
    sku: product.sku,
    name: product.name,
    category: product.category,
    price: product.price,
    compare_at_price: product.compareAtPrice ?? null,
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    is_new: product.isNew ?? false,
    is_featured: product.isFeatured ?? false,
    stock: product.stock ?? 0,
    description: product.description ?? "",
    details: product.details ?? [],
    image: product.image ?? null,
  };
}

export async function getAllProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return data.map(mapProductRow);
}

export async function getProductById(id) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return mapProductRow(data);
}

export async function getProductsByCategory(category) {
  if (!category || category === "All") return getAllProducts();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("category", category)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data.map(mapProductRow);
}

export async function searchProducts(query) {
  const q = query.trim();
  if (!q) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${q}%,category.ilike.%${q}%,sku.ilike.%${q}%`);
  if (error) throw error;
  return data.map(mapProductRow);
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase.from("products").select("*").eq("is_featured", true);
  if (error) throw error;
  return data.map(mapProductRow);
}

export async function getRelatedProducts(product, limit = 4) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(limit);
  if (error) throw error;
  return data.map(mapProductRow);
}

export async function createProduct(product) {
  const id = `p${String(Date.now()).slice(-6)}`;
  const { data, error } = await supabase
    .from("products")
    .insert({ id, ...toRow(product), rating: 0, review_count: 0 })
    .select()
    .single();
  if (error) throw error;
  return mapProductRow(data);
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase.from("products").update(toRow(updates)).eq("id", id).select().single();
  if (error) throw error;
  return mapProductRow(data);
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function uploadProductImage(file) {
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
