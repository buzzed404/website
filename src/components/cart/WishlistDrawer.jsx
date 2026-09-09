import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import * as productService from "../../services/productService";
import ProductVisual from "../product/ProductVisual";
import PriceTag from "../ui/PriceTag";
import Button from "../ui/Button";
import { CloseIcon, TrashIcon } from "../ui/Icons";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import "./cart.css";

export default function WishlistDrawer({ open, onClose }) {
  const { productIds, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    productService.getAllProducts().then((all) => setProducts(all.filter((p) => productIds.includes(p.id))));
    return () => (document.body.style.overflow = "");
  }, [open, productIds]);

  const moveToCart = (product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes[0],
      color: product.colors[0],
      sku: product.sku,
      category: product.category,
      qty: 1,
    });
    removeFromWishlist(product.id);
    showToast("Moved to cart");
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="drawer__backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            aria-label="Wishlist"
          >
            <div className="drawer__header">
              <h3>Wishlist ({products.length})</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Close wishlist">
                <CloseIcon />
              </button>
            </div>
            <div className="drawer__body">
              {products.length === 0 ? (
                <div className="empty-state">
                  <h3>Nothing saved yet</h3>
                  <p>Tap the heart on any product to save it here.</p>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="cart-row">
                    <Link to={`/product/${product.id}`} className="cart-row__media" onClick={onClose}>
                      <ProductVisual category={product.category} sku={product.sku} size="sm" />
                    </Link>
                    <div className="cart-row__body">
                      <Link to={`/product/${product.id}`} className="cart-row__name" onClick={onClose}>
                        {product.name}
                      </Link>
                      <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
                      <div className="cart-row__controls">
                        <Button size="sm" variant="secondary" onClick={() => moveToCart(product)}>
                          Move to Cart
                        </Button>
                      </div>
                    </div>
                    <button className="cart-row__remove" onClick={() => removeFromWishlist(product.id)} aria-label="Remove from wishlist">
                      <TrashIcon width={18} height={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
