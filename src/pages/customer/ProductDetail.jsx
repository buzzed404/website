import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import ImageGallery from "../../components/product/ImageGallery";
import SizeSelector from "../../components/product/SizeSelector";
import ColorSwatches from "../../components/product/ColorSwatches";
import ReviewList from "../../components/product/ReviewList";
import ReviewForm from "../../components/product/ReviewForm";
import ProductGrid from "../../components/product/ProductGrid";
import StarRating from "../../components/ui/StarRating";
import PriceTag from "../../components/ui/PriceTag";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { HeartIcon, TruckIcon, CheckIcon } from "../../components/ui/Icons";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import * as productService from "../../services/productService";
import * as reviewService from "../../services/reviewService";
import "../pages.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    setLoading(true);
    productService.getProductById(id).then(async (data) => {
      if (!active) return;
      setProduct(data);
      setLoading(false);
      if (data) {
        setSize(data.sizes[0]);
        setColor(data.colors[0]);
        const [rel, revs] = await Promise.all([
          productService.getRelatedProducts(data),
          reviewService.getReviewsByProduct(data.id),
        ]);
        if (active) {
          setRelated(rel);
          setReviews(revs);
        }
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="container page-section">Loading...</div>;
  }

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size,
      color,
      sku: product.sku,
      category: product.category,
      qty,
    });
    showToast("Added to cart");
  };

  return (
    <div className="container page-section">
      <nav style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)", color: "var(--color-text-faint)", marginBottom: "24px", textTransform: "uppercase" }}>
        <Link to="/shop">Shop</Link> / <Link to={`/shop/${product.category}`}>{product.category}</Link> / {product.name}
      </nav>

      <div className="product-detail">
        <ImageGallery category={product.category} sku={product.sku} />

        <div className="product-detail__info">
          <div>
            <span className="eyebrow">{product.category}</span>
            <h1 className="product-detail__title">{product.name}</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <StarRating value={product.rating} />
            <span style={{ color: "var(--color-text-muted)", fontSize: "var(--fs-sm)" }}>
              {product.reviewCount} reviews
            </span>
            {product.isNew && <Badge variant="new">New</Badge>}
          </div>

          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />

          <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>{product.description}</p>

          <div className="option-group">
            <div className="option-group__label">
              <span>Colour: {color}</span>
            </div>
            <ColorSwatches colors={product.colors} selected={color} onSelect={setColor} />
          </div>

          <div className="option-group">
            <div className="option-group__label">
              <span>Size: {size}</span>
              <button style={{ background: "none", border: "none", color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)" }}>
                Size Guide
              </button>
            </div>
            <SizeSelector sizes={product.sizes} selected={size} onSelect={setSize} />
          </div>

          <div className="qty-row">
            <div className="qty-stepper" style={{ height: "44px" }}>
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                +
              </button>
            </div>
            <span style={{ color: "var(--color-text-muted)", fontSize: "var(--fs-sm)" }}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="product-actions">
            <Button variant="primary" full onClick={handleAddToCart} disabled={product.stock === 0}>
              Add to Cart — <PriceTag price={product.price * qty} />
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                toggleWishlist(product.id);
                showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
              }}
              aria-label="Toggle wishlist"
            >
              <HeartIcon filled={wishlisted} />
            </Button>
          </div>

          <div className="trust-badges">
            <div className="trust-badges__row">
              <TruckIcon width={18} height={18} />
              <span>Free shipping on orders over ₹2,999. Delivered in 3–6 business days.</span>
            </div>
            <div className="trust-badges__row">
              <CheckIcon width={18} height={18} />
              <span>Easy 7-day returns. See our <Link to="/delivery-returns" style={{ color: "var(--color-accent)" }}>returns policy</Link>.</span>
            </div>
          </div>
        </div>
      </div>

      <section style={{ marginTop: "var(--space-9)" }}>
        <div className="tabs">
          {["description", "details", "reviews"].map((t) => (
            <button key={t} className="tab-btn" data-active={tab === t} onClick={() => setTab(t)}>
              {t} {t === "reviews" ? `(${reviews.length})` : ""}
            </button>
          ))}
        </div>

        {tab === "description" && <p style={{ color: "var(--color-text-muted)", lineHeight: 1.8, maxWidth: "720px" }}>{product.description}</p>}
        {tab === "details" && (
          <ul style={{ color: "var(--color-text-muted)", lineHeight: 2, listStyle: "disc", paddingLeft: "20px" }}>
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
        {tab === "reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
            <ReviewList reviews={reviews} rating={product.rating} reviewCount={product.reviewCount} />
            <div>
              <h3 className="section-heading" style={{ fontSize: "1.25rem", marginBottom: "16px" }}>
                Write a Review
              </h3>
              <ReviewForm productId={product.id} onSubmitted={(r) => setReviews((prev) => [r, ...prev])} />
            </div>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section style={{ marginTop: "var(--space-9)" }}>
          <div className="section-header">
            <div>
              <span className="eyebrow">// You Might Also Like</span>
              <h2 className="section-heading">Complete the Fit</h2>
            </div>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
