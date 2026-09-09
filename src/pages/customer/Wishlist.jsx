import { useEffect, useState } from "react";
import { useWishlist } from "../../context/WishlistContext";
import ProductGrid from "../../components/product/ProductGrid";
import ProductGridSkeleton from "../../components/product/ProductGridSkeleton";
import Button from "../../components/ui/Button";
import * as productService from "../../services/productService";
import "../pages.css";

export default function Wishlist() {
  const { productIds } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAllProducts().then((all) => {
      setProducts(all.filter((p) => productIds.includes(p.id)));
      setLoading(false);
    });
  }, [productIds]);

  return (
    <div className="container page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">// Wishlist</span>
          <h1 className="section-heading">Saved for Later ({productIds.length})</h1>
        </div>
        <Button to="/shop" variant="ghost">
          Continue Shopping →
        </Button>
      </div>
      {loading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={products} emptyMessage="Tap the heart on any product to save it here." />}
    </div>
  );
}
