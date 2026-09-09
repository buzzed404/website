import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import "../pages.css";

export default function NotFound() {
  return (
    <div className="container">
      <motion.div className="not-found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="eyebrow">// System Status: Unknown</span>
        <h1 className="not-found__code">404</h1>
        <h2 className="section-heading">Normality Not Found.</h2>
        <p style={{ color: "var(--color-text-muted)", maxWidth: "420px" }}>
          The page you're looking for doesn't exist — or maybe it's just buzzed. Either way, let's get you back on track.
        </p>
        <Button to="/" variant="primary">
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}
