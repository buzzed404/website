import { COLOR_SWATCHES } from "../../utils/constants";
import "./product.css";

export default function ColorSwatches({ colors, selected, onSelect }) {
  return (
    <div className="color-selector" role="radiogroup" aria-label="Select colour">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className="color-chip"
          data-active={selected === color}
          style={{ background: COLOR_SWATCHES[color] || "#333" }}
          role="radio"
          aria-checked={selected === color}
          aria-label={color}
          title={color}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  );
}
