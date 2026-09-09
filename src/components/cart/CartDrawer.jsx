import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import CartItemRow from "./CartItemRow";
import Button from "../ui/Button";
import { CloseIcon } from "../ui/Icons";
import { formatCurrency } from "../../utils/format";
import "./cart.css";

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal } = useCart();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            aria-label="Shopping cart"
          >
            <div className="drawer__header">
              <h3>Your Cart ({items.reduce((s, i) => s + i.qty, 0)})</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Close cart">
                <CloseIcon />
              </button>
            </div>
            <div className="drawer__body">
              {items.length === 0 ? (
                <div className="empty-state">
                  <h3>Your cart is empty</h3>
                  <p>Add something bold before it's gone.</p>
                </div>
              ) : (
                items.map((item) => <CartItemRow key={`${item.productId}-${item.size}-${item.color}`} item={item} />)
              )}
            </div>
            {items.length > 0 && (
              <div className="drawer__footer">
                <div className="summary-row summary-row--total">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <Button to="/cart" variant="secondary" full onClick={onClose}>
                  View Cart
                </Button>
                <Button to="/checkout" variant="primary" full onClick={onClose}>
                  Checkout
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
