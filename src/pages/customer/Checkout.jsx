import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { CheckIcon } from "../../components/ui/Icons";
import { formatCurrency } from "../../utils/format";
import { isRequired, isValidEmail, isValidPincode, isValidCardNumber } from "../../utils/validators";
import * as orderService from "../../services/orderService";
import "../pages.css";

const STEPS = ["Shipping", "Payment", "Review"];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { session } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [errors, setErrors] = useState({});
  const [shipping, setShipping] = useState({
    name: session?.name || "",
    email: session?.email || "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const [payment, setPayment] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "" });

  const shippingCost = subtotal >= 2999 || subtotal === 0 ? 0 : 149;
  const total = subtotal + shippingCost;

  if (items.length === 0 && !placed) {
    return <Navigate to="/cart" replace />;
  }

  const validateShipping = () => {
    const next = {};
    if (!isRequired(shipping.name)) next.name = "Required";
    if (!isValidEmail(shipping.email)) next.email = "Enter a valid email";
    if (!isRequired(shipping.address)) next.address = "Required";
    if (!isRequired(shipping.city)) next.city = "Required";
    if (!isValidPincode(shipping.pincode)) next.pincode = "Enter a valid pincode";
    if (!isRequired(shipping.phone)) next.phone = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validatePayment = () => {
    const next = {};
    if (!isRequired(payment.cardName)) next.cardName = "Required";
    if (!isValidCardNumber(payment.cardNumber)) next.cardNumber = "Enter a valid card number";
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) next.expiry = "MM/YY";
    if (!/^\d{3,4}$/.test(payment.cvv)) next.cvv = "Invalid CVV";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateShipping()) return;
    if (step === 1 && !validatePayment()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    const order = await orderService.createOrder({
      email: shipping.email,
      customerName: shipping.name,
      items: items.map((i) => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price, size: i.size, color: i.color })),
      total,
    });
    setPlaced(true);
    clearCart();
    showToast("Order placed successfully!");
    navigate(`/order-confirmation?order=${order.id}`);
  };

  return (
    <div className="container page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">// Checkout</span>
          <h1 className="section-heading">Complete Your Order</h1>
        </div>
      </div>

      <div className="checkout-steps">
        {STEPS.map((label, i) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="checkout-step" data-active={step === i} data-done={step > i}>
              <span className="checkout-step__dot">{step > i ? <CheckIcon width={14} height={14} /> : i + 1}</span>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="checkout-step__sep" />}
          </span>
        ))}
      </div>

      <div className="checkout-layout">
        <div>
          {step === 0 && (
            <div className="form-stack">
              <Field label="Full Name" id="name" value={shipping.name} error={errors.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} />
              <Field label="Email" id="email" type="email" value={shipping.email} error={errors.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} />
              <Field label="Address" id="address" value={shipping.address} error={errors.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} />
              <div className="form-grid-2">
                <Field label="City" id="city" value={shipping.city} error={errors.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
                <Field label="Pincode" id="pincode" value={shipping.pincode} error={errors.pincode} onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })} />
              </div>
              <Field label="Phone" id="phone" value={shipping.phone} error={errors.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} />
              <Button variant="primary" onClick={handleNext}>
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="form-stack">
              <p className="demo-note">This is a static demo — no real payment is processed. Enter any sample details.</p>
              <Field label="Name on Card" id="cardName" value={payment.cardName} error={errors.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} />
              <Field label="Card Number" id="cardNumber" placeholder="1234 1234 1234 1234" value={payment.cardNumber} error={errors.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} />
              <div className="form-grid-2">
                <Field label="Expiry (MM/YY)" id="expiry" placeholder="08/29" value={payment.expiry} error={errors.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} />
                <Field label="CVV" id="cvv" placeholder="123" value={payment.cvv} error={errors.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <Button variant="secondary" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button variant="primary" onClick={handleNext}>
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-stack">
              <div>
                <h4 style={{ marginBottom: "8px" }}>Shipping To</h4>
                <p style={{ color: "var(--color-text-muted)" }}>
                  {shipping.name}, {shipping.address}, {shipping.city} - {shipping.pincode}
                  <br />
                  {shipping.email} · {shipping.phone}
                </p>
              </div>
              <div>
                <h4 style={{ marginBottom: "8px" }}>Payment</h4>
                <p style={{ color: "var(--color-text-muted)" }}>
                  Card ending in {payment.cardNumber.slice(-4) || "----"}
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? "Placing Order..." : `Place Order — ${formatCurrency(total)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="order-summary-card">
          <h3 className="section-heading" style={{ fontSize: "1.1rem" }}>
            Order Summary
          </h3>
          {items.map((item) => (
            <div className="order-line" key={`${item.productId}-${item.size}-${item.color}`}>
              <span>
                {item.name} ({item.size}/{item.color}) × {item.qty}
              </span>
              <span>{formatCurrency(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
          </div>
          <div className="summary-row summary-row--total">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
