import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../services/storage";

const CartContext = createContext(null);
const KEY = "cart";

function lineKey(item) {
  return `${item.productId}__${item.size}__${item.color}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStorage(KEY, []));

  useEffect(() => {
    writeStorage(KEY, items);
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => {
      const key = lineKey(item);
      const existing = prev.find((p) => lineKey(p) === key);
      if (existing) {
        return prev.map((p) => (lineKey(p) === key ? { ...p, qty: p.qty + item.qty } : p));
      }
      return [...prev, item];
    });
  };

  const updateQty = (key, qty) => {
    setItems((prev) => prev.map((p) => (lineKey(p) === key ? { ...p, qty: Math.max(1, qty) } : p)));
  };

  const removeItem = (key) => {
    setItems((prev) => prev.filter((p) => lineKey(p) !== key));
  };

  const clearCart = () => setItems([]);

  const { subtotal, itemCount } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        subtotal: acc.subtotal + item.price * item.qty,
        itemCount: acc.itemCount + item.qty,
      }),
      { subtotal: 0, itemCount: 0 }
    );
  }, [items]);

  const value = { items, addItem, updateQty, removeItem, clearCart, subtotal, itemCount, lineKey };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
