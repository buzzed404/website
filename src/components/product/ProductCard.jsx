import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductVisual from "./ProductVisual";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import PriceTag from "../ui/PriceTag";
import StarRating from "../ui/StarRating";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import "./product.css";

export default function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
    showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes[0],
      color: product.colors[0],
      sku: product.sku,
      category: product.category,
      image: product.image,
      qty: 1,
    });
    showToast("Added to cart");
  };

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link to={`/product/${product.id}`} className="product-card__media">
        <div className="product-card__badges">
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.compareAtPrice && <Badge variant="sale">Sale</Badge>}
        </div>
        <button
          className="product-card__wishlist"
          data-active={wishlisted}
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20s-7-4.35-9.5-8.5C.7 8.2 2.2 4.5 6 4.5c2 0 3.5 1.2 6 3.5 2.5-2.3 4-3.5 6-3.5 3.8 0 5.3 3.7 3.5 7C19 15.65 12 20 12 20z" />
          </svg>
        </button>
        <ProductVisual category={product.category} sku={product.sku} image={product.image} />
        <div className="product-card__quickadd">
          <Button variant="primary" size="sm" full onClick={handleQuickAdd}>
            Quick Add
          </Button>
        </div>
      </Link>
      <Link to={`/product/${product.id}`} className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <span className="product-card__name">{product.name}</span>
        <div className="product-card__meta">
          <StarRating value={product.rating} />
          <span>({product.reviewCount})</span>
        </div>
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
      </Link>
    </motion.article>
  );
}
