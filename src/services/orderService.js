import { supabase } from "../lib/supabaseClient";

function mapOrderRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    customerName: row.customer_name,
    email: row.email,
    status: row.status,
    total: row.total,
    items: row.items ?? [],
    date: row.created_at ? row.created_at.slice(0, 10) : null,
  };
}

export async function getAllOrders() {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(mapOrderRow);
}

export async function getOrdersByEmail(email) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .ilike("email", email)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(mapOrderRow);
}

export async function getOrderById(id) {
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return mapOrderRow(data);
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return mapOrderRow(data);
}

export async function createOrder({ email, customerName, items, total }) {
  const id = `BZ${String(Date.now()).slice(-9)}`;
  const row = { id, email, customer_name: customerName, items, total, status: "Pending" };
  // Insert without .select() — a guest checkout has no session, and reading
  // the row back would additionally require satisfying the SELECT policy,
  // which a guest can't. We already know every field, so just return it.
  const { error } = await supabase.from("orders").insert(row);
  if (error) throw error;
  return mapOrderRow({ ...row, created_at: new Date().toISOString() });
}
