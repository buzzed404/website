import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import "../pages.css";

const OFFERS = [
  { code: "CODE10", title: "10% Off Your First Order", desc: "New here? Take 10% off your first purchase, storewide." },
  { code: "BUZZ20", title: "20% Off Orders Above ₹4,000", desc: "Stock up on Drop 001 essentials and save big." },
  { code: "FREESHIP", title: "Free Shipping, No Minimum", desc: "Applied automatically on orders over ₹2,999." },
];

export default function Offers() {
  return (
    <div className="container page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">// Offers</span>
          <h1 className="section-heading">Current Deals</h1>
          <p>Stack the savings before Drop 001 sells out.</p>
        </div>
      </div>

      <div className="offers-grid">
        {OFFERS.map((offer, i) => (
          <motion.div
            className="offer-card"
            key={offer.code}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <span className="eyebrow">{offer.code}</span>
            <h3 style={{ fontSize: "var(--fs-md)" }}>{offer.title}</h3>
            <p style={{ color: "var(--color-text-muted)" }}>{offer.desc}</p>
            <Button to="/shop" variant="secondary" size="sm">
              Shop Now
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="offer-strip" style={{ marginTop: "var(--space-8)" }}>
        <div>
          <h3 style={{ fontSize: "var(--fs-lg)" }}>Refer a Friend, Get ₹500</h3>
          <p style={{ color: "var(--color-text-muted)" }}>Share your code, they get 10% off, you get store credit.</p>
        </div>
        <Button variant="primary">Get My Code</Button>
      </div>
    </div>
  );
}
