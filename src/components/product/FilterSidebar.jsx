import { CATEGORIES, COLOR_SWATCHES } from "../../utils/constants";
import "./product.css";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PRICE_RANGES = [
  { label: "Under ₹1,500", min: 0, max: 1500 },
  { label: "₹1,500 – ₹2,500", min: 1500, max: 2500 },
  { label: "₹2,500 – ₹3,500", min: 2500, max: 3500 },
  { label: "Above ₹3,500", min: 3500, max: Infinity },
];

export default function FilterSidebar({ filters, onChange, showCategory = true }) {
  const toggle = (key, value) => {
    const current = filters[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const togglePriceRange = (range) => {
    const exists = filters.priceRanges.some((r) => r.label === range.label);
    const next = exists ? filters.priceRanges.filter((r) => r.label !== range.label) : [...filters.priceRanges, range];
    onChange({ ...filters, priceRanges: next });
  };

  return (
    <div className="filters">
      {showCategory && (
        <div className="filter-group">
          <h4>Category</h4>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="filter-option" data-active={filters.categories.includes(cat)}>
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggle("categories", cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      )}

      <div className="filter-group">
        <h4>Size</h4>
        {SIZES.map((size) => (
          <label key={size} className="filter-option" data-active={filters.sizes.includes(size)}>
            <input type="checkbox" checked={filters.sizes.includes(size)} onChange={() => toggle("sizes", size)} />
            {size}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Colour</h4>
        {Object.keys(COLOR_SWATCHES).map((color) => (
          <label key={color} className="filter-option" data-active={filters.colors.includes(color)}>
            <input type="checkbox" checked={filters.colors.includes(color)} onChange={() => toggle("colors", color)} />
            {color}
          </label>
        ))}
      </div>

      <div className="filter-group" style={{ borderBottom: "none" }}>
        <h4>Price</h4>
        {PRICE_RANGES.map((range) => (
          <label key={range.label} className="filter-option" data-active={filters.priceRanges.some((r) => r.label === range.label)}>
            <input
              type="checkbox"
              checked={filters.priceRanges.some((r) => r.label === range.label)}
              onChange={() => togglePriceRange(range)}
            />
            {range.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export function createEmptyFilters() {
  return { categories: [], sizes: [], colors: [], priceRanges: [] };
}

export function applyFilters(products, filters) {
  return products.filter((p) => {
    if (filters.categories.length && !filters.categories.includes(p.category)) return false;
    if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
    if (filters.colors.length && !p.colors.some((c) => filters.colors.includes(c))) return false;
    if (filters.priceRanges.length && !filters.priceRanges.some((r) => p.price >= r.min && p.price < r.max)) return false;
    return true;
  });
}

export function sortProducts(products, sortKey) {
  const list = [...products];
  switch (sortKey) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    case "newest":
      return list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    default:
      return list;
  }
}
