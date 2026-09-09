import { supabase } from "../lib/supabaseClient";

function mapReviewRow(row) {
  return {
    id: row.id,
    productId: row.product_id,
    author: row.author,
    rating: row.rating,
    title: row.title,
    body: row.body,
    date: row.created_at ? row.created_at.slice(0, 10) : null,
  };
}

export async function getReviewsByProduct(productId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(mapReviewRow);
}

export async function addReview(review) {
  const id = `r${String(Date.now()).slice(-6)}`;
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      id,
      product_id: review.productId,
      author: review.author,
      rating: review.rating,
      title: review.title,
      body: review.body,
    })
    .select()
    .single();
  if (error) throw error;
  return mapReviewRow(data);
}
