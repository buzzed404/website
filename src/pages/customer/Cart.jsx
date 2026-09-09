import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartItemRow from "../../components/cart/CartItemRow";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import { formatCurrency } from "../../utils/format";
import { useToast } from "../../context/ToastContext";
import "../../components/cart/cart.css";
import "../pages.css";

const VALID_PROMO = { CODE10: 0.1, BUZZ20: 0.2 };

export default function Cart() {
  const { items, subtotal } = useCart();
  const { showToast } = useToast();
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promo.trim().toUpperCase();
    if (VALID_PROMO[code]) {
      setApplied({ code, rate: VALID_PROMO[code] });
      showToast(`Promo ${code} applied`);
    } else {
      showToast("Invalid promo code", { type: "error" });
    }
  };

  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 149;
  const discount = applied ? subtotal * applied.rate : 0;
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="container page-section">
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <div style={{ marginTop: "20px" }}>
            <Button to="/shop" variant="primary">
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">// Cart</span>
          <h1 className="section-heading">Your Bag ({items.reduce((s, i) => s + i.qty, 0)})</h1>
        </div>
      </div>

      <div className="cart-page-layout">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} style={{ paddingBottom: "var(--space-5)", borderBottom: "1px solid var(--color-border)" }}>
              <CartItemRow item={item} />
            </div>
          ))}
        </div>

        <div className="order-summary-card">
          <h3 className="section-heading" style={{ fontSize: "1.1rem" }}>
            Order Summary
          </h3>
          <form onSubmit={handleApplyPromo} style={{ display: "flex", gap: "8px" }}>
            <Field id="promo" placeholder="Promo code (try CODE10)" value={promo} onChange={(e) => setPromo(e.target.value)} />
            <Button type="submit" variant="secondary" size="sm">
              Apply
            </Button>
          </form>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {applied && (
            <div className="summary-row">
              <span>Discount ({applied.code})</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
          </div>
          <div className="summary-row summary-row--total">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Button to="/checkout" variant="primary" full>
            Proceed to Checkout
          </Button>
          <Link to="/shop" style={{ textAlign: "center", fontSize: "var(--fs-sm)", color: "var(--color-text-muted)" }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
