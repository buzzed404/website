import { supabase } from "../lib/supabaseClient";

async function fetchProfile(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

function toSession(user, profile) {
  return {
    role: profile?.role || "customer",
    email: user.email,
    name: profile?.name || user.email.split("@")[0],
  };
}

export async function loginCustomer({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const profile = await fetchProfile(data.user.id);
  return toSession(data.user, profile);
}

export async function registerCustomer({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  if (!data.session) {
    throw new Error("Check your inbox to confirm your email before signing in.");
  }
  // The profiles row is created server-side by the handle_new_user() trigger
  // (see supabase/schema.sql) — no client-side insert needed here.
  return toSession(data.user, { name, role: "customer" });
}

export async function loginAdmin({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const profile = await fetchProfile(data.user.id);
  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    throw new Error("This account doesn't have admin access.");
  }
  return toSession(data.user, profile);
}

export async function logout() {
  await supabase.auth.signOut();
  return true;
}

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  const profile = await fetchProfile(session.user.id);
  return toSession(session.user, profile);
}
