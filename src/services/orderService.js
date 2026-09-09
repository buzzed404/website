import seedOrders from "../data/orders.mock.json";
import { readStorage, writeStorage } from "./storage";

const KEY = "orders";

function seedIfEmpty() {
  const existing = readStorage(KEY, null);
  if (!existing) {
    writeStorage(KEY, seedOrders);
    return seedOrders;
  }
  return existing;
}

export async function getAllOrders() {
  return [...seedIfEmpty()].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getOrdersByEmail(email) {
  const orders = seedIfEmpty();
  return orders.filter((o) => o.email.toLowerCase() === email.toLowerCase());
}

export async function getOrderById(id) {
  const orders = seedIfEmpty();
  return orders.find((o) => o.id === id) ?? null;
}

export async function updateOrderStatus(id, status) {
  const orders = seedIfEmpty();
  const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
  writeStorage(KEY, next);
  return next.find((o) => o.id === id);
}

export async function createOrder({ email, customerName, items, total }) {
  const orders = seedIfEmpty();
  const id = `BZ${String(Date.now()).slice(-9)}`;
  const newOrder = {
    id,
    email,
    customerName,
    items,
    total,
    date: new Date().toISOString().slice(0, 10),
    status: "Pending",
  };
  writeStorage(KEY, [...orders, newOrder]);
  return newOrder;
}
