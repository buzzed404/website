import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { CATEGORIES, COLOR_SWATCHES } from "../../utils/constants";
import { useToast } from "../../context/ToastContext";
import * as productService from "../../services/productService";
import "../pages.css";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "One Size"];

const EMPTY_FORM = {
  name: "",
  sku: "",
  category: CATEGORIES[0],
  price: "",
  compareAtPrice: "",
  stock: "",
  colors: [],
  sizes: [],
  description: "",
  details: "",
  isNew: false,
  isFeatured: false,
  image: "",
};

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    productService.getProductById(id).then((p) => {
      if (p) {
        setForm({
          ...p,
          price: String(p.price),
          compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "",
          stock: String(p.stock),
          details: p.details.join("\n"),
        });
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const toggleArrayField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((v) => v !== value) : [...prev[field], value],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      showToast("Image too large — please use one under 1.5MB.", { type: "error" });
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      price: Number(form.price) || 0,
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock) || 0,
      colors: form.colors,
      sizes: form.sizes,
      description: form.description,
      details: form.details.split("\n").map((d) => d.trim()).filter(Boolean),
      isNew: form.isNew,
      isFeatured: form.isFeatured,
      image: form.image || null,
    };

    if (isEdit) {
      await productService.updateProduct(id, payload);
      showToast("Product updated");
    } else {
      await productService.createProduct(payload);
      showToast("Product created");
    }
    navigate("/admin/products");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="section-header">
        <div>
          <span className="eyebrow">// Catalog</span>
          <h1 className="section-heading">{isEdit ? "Edit Product" : "Add Product"}</h1>
        </div>
      </div>

      <form className="form-stack" style={{ maxWidth: "640px" }} onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <Field label="Product Name" id="name" value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Field label="SKU" id="sku" value={form.sku} required onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        </div>

        <Field label="Category" id="category" as="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Field>

        <div className="form-grid-2">
          <Field label="Price (₹)" id="price" type="number" value={form.price} required onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Field label="Compare-at Price (₹)" id="compareAtPrice" type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
        </div>

        <Field label="Stock" id="stock" type="number" value={form.stock} required onChange={(e) => setForm({ ...form, stock: e.target.value })} />

        <div className="option-group">
          <div className="option-group__label">
            <span>Product Image</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {form.image ? (
              <img
                src={form.image}
                alt="Product preview"
                style={{ width: 84, height: 84, objectFit: "cover", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}
              />
            ) : (
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: "var(--radius-md)",
                  border: "1px dashed var(--color-border-strong)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-faint)",
                  fontSize: "var(--fs-xs)",
                  fontFamily: "var(--font-mono)",
                  textAlign: "center",
                  padding: "4px",
                }}
              >
                No Image
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input type="file" accept="image/*" id="image" onChange={handleImageChange} />
              {form.image && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, image: "" })}>
                  Remove Image
                </Button>
              )}
              <span style={{ color: "var(--color-text-faint)", fontSize: "var(--fs-xs)" }}>
                JPG or PNG, under 1.5MB. Without one, a placeholder icon is shown.
              </span>
            </div>
          </div>
        </div>

        <div className="option-group">
          <div className="option-group__label">
            <span>Sizes</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {ALL_SIZES.map((size) => (
              <label key={size} className="filter-option" data-active={form.sizes.includes(size)}>
                <input type="checkbox" checked={form.sizes.includes(size)} onChange={() => toggleArrayField("sizes", size)} />
                {size}
              </label>
            ))}
          </div>
        </div>

        <div className="option-group">
          <div className="option-group__label">
            <span>Colours</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {Object.keys(COLOR_SWATCHES).map((color) => (
              <label key={color} className="filter-option" data-active={form.colors.includes(color)}>
                <input type="checkbox" checked={form.colors.includes(color)} onChange={() => toggleArrayField("colors", color)} />
                {color}
              </label>
            ))}
          </div>
        </div>

        <Field label="Description" id="description" as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Field label="Details (one per line)" id="details" as="textarea" rows={4} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />

        <div style={{ display: "flex", gap: "20px" }}>
          <label className="filter-option" data-active={form.isNew}>
            <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} />
            Mark as New
          </label>
          <label className="filter-option" data-active={form.isFeatured}>
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
            Featured
          </label>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Button variant="secondary" type="button" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEdit ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
