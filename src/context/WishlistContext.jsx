import { createContext, useContext, useEffect, useState } from "react";
import { readStorage, writeStorage } from "../services/storage";

const WishlistContext = createContext(null);
const KEY = "wishlist";

export function WishlistProvider({ children }) {
  const [productIds, setProductIds] = useState(() => readStorage(KEY, []));

  useEffect(() => {
    writeStorage(KEY, productIds);
  }, [productIds]);

  const isWishlisted = (id) => productIds.includes(id);

  const toggleWishlist = (id) => {
    setProductIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const removeFromWishlist = (id) => setProductIds((prev) => prev.filter((p) => p !== id));

  const value = { productIds, isWishlisted, toggleWishlist, removeFromWishlist };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
