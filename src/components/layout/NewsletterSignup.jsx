import { useState } from "react";
import Field from "../ui/Field";
import Button from "../ui/Button";
import { isValidEmail } from "../../utils/validators";
import { useToast } from "../../context/ToastContext";
import "./layout.css";

export default function NewsletterSignup({ variant = "section" }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    showToast("You're on the list!");
  };

  return (
    <div className={variant === "footer" ? "newsletter-footer" : ""}>
      <div className="newsletter">
        <span className="eyebrow">// Stay Buzzed</span>
        <h3 className="section-heading" style={{ fontSize: "1.5rem" }}>
          Get 10% off your first drop
        </h3>
        <p style={{ color: "var(--color-text-muted)" }}>
          Sign up for restock alerts, new drops and exclusive offers.
        </p>
        {submitted ? (
          <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}>✓ Subscribed — check your inbox.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <Field
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
