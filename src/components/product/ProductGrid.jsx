import ProductCard from "./ProductCard";
import "./product.css";

export default function ProductGrid({ products, emptyMessage = "No products found." }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <h3>Nothing here yet</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
