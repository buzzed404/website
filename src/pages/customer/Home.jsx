import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImg from "../../assets/images/brand-drop-001.jpg";
import storyImg from "../../assets/images/brand-product-tease.jpg";
import Button from "../../components/ui/Button";
import ProductGrid from "../../components/product/ProductGrid";
import ProductGridSkeleton from "../../components/product/ProductGridSkeleton";
import NewsletterSignup from "../../components/layout/NewsletterSignup";
import StarRating from "../../components/ui/StarRating";
import { CATEGORIES } from "../../utils/constants";
import { useEffect, useState } from "react";
import * as productService from "../../services/productService";
import "../pages.css";

const CATEGORY_ICON_PATH = {
  Hoodies: "M22 58V34Q22 20 32 20Q42 20 42 34V58 M26 20Q26 10 32 10Q38 10 38 20 M29 25V31 M35 25V31",
  Tees: "M20 58V28Q20 22 26 20L32 26L38 20Q44 22 44 28V58Z",
  Sweatshirts: "M20 58V28Q20 22 26 20Q32 25 38 20Q44 22 44 28V58Z M25 22Q32 28 39 22",
  Bottoms: "M22 12H42Q44 12 44 16L45 58H36L32 30L28 58H19L20 16Q20 12 22 12Z",
  Accessories: "M24 24Q24 14 32 14Q40 14 40 24 M18 24H46L44 56H20Z",
};

const TESTIMONIALS = [
  { name: "Aarav K.", quote: "The fit and fabric quality is unmatched. Every piece feels intentional, not just printed merch.", rating: 5 },
  { name: "Diya N.", quote: "Drop 001 sold out before I could blink. Managed to grab the tee and it's already my favorite.", rating: 5 },
  { name: "Rohan D.", quote: "Streetwear that doesn't try too hard. Clean, bold, and genuinely comfortable.", rating: 4 },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getFeaturedProducts().then((data) => {
      setFeatured(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <section className="hero">
        <img src={heroImg} alt="BUZZED.404 Drop 001 promotional art" className="hero__bg" />
        <div className="hero__gradient" />
        <div className="container hero__content">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            // System Status: Live
          </motion.span>
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            Normality <span className="accent">Not Found.</span> Drop 001 is Live.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{ color: "var(--color-text-muted)", fontSize: "var(--fs-md)" }}
          >
            Unisex streetwear built for misfits. Heavyweight fabrics, bold graphics, zero normality.
          </motion.p>
          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <Button to="/shop" variant="primary">
              Shop Drop 001
            </Button>
            <Button to="/shop/Hoodies" variant="secondary">
              Explore Hoodies
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="container page-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">// Shop by Category</span>
            <h2 className="section-heading">Find Your Fit</h2>
          </div>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link to={`/shop/${cat}`} className="category-tile">
                <svg viewBox="0 0 64 64" className="category-tile__icon">
                  <path d={CATEGORY_ICON_PATH[cat]} />
                </svg>
                <span>{cat}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">// Featured</span>
            <h2 className="section-heading">New &amp; Noteworthy</h2>
            <p>The pieces everyone's adding to cart this week.</p>
          </div>
          <Button to="/shop" variant="ghost">
            View All →
          </Button>
        </div>
        {loading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={featured} />}
      </section>

      <section className="container page-section" id="brand-story">
        <div className="brand-story">
          <motion.img
            src={storyImg}
            alt="BUZZED.404 apparel detail"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="brand-story__body"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow">// Our Story</span>
            <h2 className="section-heading">Made for Misfits, Since Day 01</h2>
            <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
              BUZZED.404 started as an error message that refused to go away. What began as a glitch became a
              statement — premium streetwear for people who'd rather stand out than fit the default. Every drop is
              limited, every piece is built to last, and every stitch says the same thing: normality not found.
            </p>
            <Button to="/shop" variant="secondary">
              Shop the Story
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="container page-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">// Customer Love</span>
            <h2 className="section-heading">Straight From the Buzzed Community</h2>
          </div>
        </div>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              className="testimonial-card"
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <StarRating value={t.rating} />
              <p style={{ color: "var(--color-text-muted)" }}>&ldquo;{t.quote}&rdquo;</p>
              <strong>{t.name}</strong>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <NewsletterSignup />
      </section>
    </div>
  );
}
