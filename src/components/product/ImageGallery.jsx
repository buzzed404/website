import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductVisual from "./ProductVisual";
import "./product.css";

const VIEWS = ["Front", "Back", "Detail", "Fabric"];

export default function ImageGallery({ category, sku }) {
  const [active, setActive] = useState(0);

  return (
    <div className="gallery">
      <div className="gallery__thumbs">
        {VIEWS.map((view, i) => (
          <button
            key={view}
            className="gallery__thumb"
            data-active={active === i}
            onClick={() => setActive(i)}
            aria-label={`View ${view}`}
          >
            <ProductVisual category={category} sku={view} size="sm" />
          </button>
        ))}
      </div>
      <div className="gallery__main">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ProductVisual category={category} sku={`${sku} // ${VIEWS[active].toUpperCase()}`} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
