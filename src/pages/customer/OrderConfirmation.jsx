import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import { CheckIcon } from "../../components/ui/Icons";
import { formatCurrency, formatDate } from "../../utils/format";
import * as orderService from "../../services/orderService";
import "../pages.css";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) orderService.getOrderById(orderId).then(setOrder);
  }, [orderId]);

  return (
    <div className="container">
      <motion.div className="confirmation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <motion.div
          className="confirmation__icon pulse-check"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CheckIcon width={32} height={32} />
        </motion.div>
        <span className="eyebrow">// Order Confirmed</span>
        <h1 className="section-heading">Thank You{order ? `, ${order.customerName.split(" ")[0]}` : ""}!</h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Your order has been placed and is now being processed. A confirmation has been sent to your email.
        </p>

        {order && (
          <div style={{ width: "100%", textAlign: "left", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-5)" }}>
            <div className="summary-row">
              <span>Order ID</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>{order.id}</span>
            </div>
            <div className="summary-row">
              <span>Date</span>
              <span>{formatDate(order.date)}</span>
            </div>
            <div className="summary-row">
              <span>Status</span>
              <span>{order.status}</span>
            </div>
            <div className="summary-row summary-row--total">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        )}

        <div className="confirmation__actions">
          <Button to="/shop" variant="primary">
            Continue Shopping
          </Button>
          <Button to="/account" variant="secondary">
            View Orders
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
