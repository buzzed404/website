import "./product.css";

/* One uniform hanger mark for every product — mirror-symmetric about x=32
   in the 64x64 viewBox so it renders dead-centre regardless of category. */
const HANGER_ICON = (
  <path d="M32 14q4 0 4 4t-4 5M32 23 10 46M32 23l22 23M10 46Q32 42 54 46" />
);

const HASH_HUES = {
  Hoodies: "142,58%",
  Tees: "158,60%",
  Sweatshirts: "168,55%",
  Bottoms: "150,45%",
  Accessories: "160,50%",
};

export default function ProductVisual({ category, sku, size = "md", image }) {
  const hue = HASH_HUES[category] || "158,60%";

  return (
    <div className={`product-visual product-visual--${size}`} style={{ "--pv-hue": hue }}>
      {image ? (
        <img src={image} alt={sku} className="product-visual__photo" />
      ) : (
        <>
          <div className="product-visual__scan" />
          <svg viewBox="0 0 64 64" className="product-visual__icon" aria-hidden="true">
            {HANGER_ICON}
          </svg>
        </>
      )}
      <span className="product-visual__sku">{sku}</span>
      <span className="product-visual__tag">
        <span className="product-visual__tag-hole" />
        Buzzed.404
      </span>
    </div>
  );
}
