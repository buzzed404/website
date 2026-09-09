import "./product.css";

const ICONS = {
  Hoodies: (
    <path d="M32 10c-6 0-9 4-9 4l-11 5 3 8 7-3v34h32V24l7 3 3-8-11-5s-3-4-9-4z" />
  ),
  Tees: (
    <path d="M22 8 12 16l4 9 6-3v30h32V22l6 3 4-9-10-8s-4 5-10 5-10-5-10-5z" />
  ),
  Sweatshirts: (
    <path d="M20 12 10 18l3 9 8-4v29h34V23l8 4 3-9-10-6s-4 4-13 4-13-4-13-4z" />
  ),
  Bottoms: (
    <path d="M18 8h28l2 46h-10l-4-28-4 28H20z" />
  ),
  Accessories: (
    <path d="M32 8a14 14 0 0 1 14 14v6H18v-6A14 14 0 0 1 32 8zm-18 24h36l-3 20H17z" />
  ),
};

const HASH_HUES = {
  Hoodies: "142,58%",
  Tees: "158,60%",
  Sweatshirts: "168,55%",
  Bottoms: "150,45%",
  Accessories: "160,50%",
};

export default function ProductVisual({ category, sku, size = "md" }) {
  const hue = HASH_HUES[category] || "158,60%";

  return (
    <div className={`product-visual product-visual--${size}`} style={{ "--pv-hue": hue }}>
      <div className="product-visual__scan" />
      <svg viewBox="0 0 64 64" className="product-visual__icon" aria-hidden="true">
        {ICONS[category] || ICONS.Tees}
      </svg>
      <span className="product-visual__sku">{sku}</span>
    </div>
  );
}
