import "./product.css";

export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="skeleton" style={{ aspectRatio: "4 / 5", width: "100%" }} />
          <div className="skeleton" style={{ height: "14px", width: "60%" }} />
          <div className="skeleton" style={{ height: "14px", width: "40%" }} />
        </div>
      ))}
    </div>
  );
}
