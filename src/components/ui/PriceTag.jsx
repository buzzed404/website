import { formatCurrency } from "../../utils/format";
import "./ui.css";

export default function PriceTag({ price, compareAtPrice }) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPct = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  return (
    <span className="price-tag">
      <span className="price-tag__current">{formatCurrency(price)}</span>
      {hasDiscount && (
        <>
          <span className="price-tag__compare">{formatCurrency(compareAtPrice)}</span>
          <span className="price-tag__discount">-{discountPct}%</span>
        </>
      )}
    </span>
  );
}
