import "./product.css";

export default function SizeSelector({ sizes, selected, onSelect }) {
  return (
    <div className="size-selector" role="radiogroup" aria-label="Select size">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          className="size-chip"
          data-active={selected === size}
          role="radio"
          aria-checked={selected === size}
          onClick={() => onSelect(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
