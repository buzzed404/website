import { ADMIN_DEMO_CREDENTIALS } from "../utils/constants";
import { readStorage, writeStorage, removeStorage } from "./storage";

const KEY = "session";

export async function loginCustomer({ email, name }) {
  const session = { role: "customer", email, name: name || email.split("@")[0] };
  writeStorage(KEY, session);
  return session;
}

export async function registerCustomer({ email, name }) {
  return loginCustomer({ email, name });
}

export async function loginAdmin({ email, password }) {
  if (email === ADMIN_DEMO_CREDENTIALS.email && password === ADMIN_DEMO_CREDENTIALS.password) {
    const session = { role: "admin", email, name: "Admin" };
    writeStorage(KEY, session);
    return session;
  }
  throw new Error("Invalid admin credentials.");
}

export async function logout() {
  removeStorage(KEY);
  return true;
}

export function getSession() {
  return readStorage(KEY, null);
}
