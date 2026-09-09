import ProductVisual from "../product/ProductVisual";
import { formatCurrency } from "../../utils/format";
import { TrashIcon } from "../ui/Icons";
import { useCart } from "../../context/CartContext";
import "./cart.css";

export default function CartItemRow({ item }) {
  const { updateQty, removeItem, lineKey } = useCart();
  const key = lineKey(item);

  return (
    <div className="cart-row">
      <div className="cart-row__media">
        <ProductVisual category={item.category} sku={item.sku} size="sm" image={item.image} />
      </div>
      <div className="cart-row__body">
        <span className="cart-row__name">{item.name}</span>
        <span className="cart-row__meta">
          {item.size} / {item.color}
        </span>
        <div className="cart-row__controls">
          <div className="qty-stepper">
            <button type="button" onClick={() => updateQty(key, item.qty - 1)} aria-label="Decrease quantity">
              −
            </button>
            <span>{item.qty}</span>
            <button type="button" onClick={() => updateQty(key, item.qty + 1)} aria-label="Increase quantity">
              +
            </button>
          </div>
          <span>{formatCurrency(item.price * item.qty)}</span>
        </div>
      </div>
      <button className="cart-row__remove" onClick={() => removeItem(key)} aria-label="Remove item">
        <TrashIcon width={18} height={18} />
      </button>
    </div>
  );
}
