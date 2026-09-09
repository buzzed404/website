import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import ProductVisual from "../../components/product/ProductVisual";
import { formatCurrency } from "../../utils/format";
import { useToast } from "../../context/ToastContext";
import * as productService from "../../services/productService";
import "../pages.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const { showToast } = useToast();

  const load = () => productService.getAllProducts().then(setProducts);

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    await productService.deleteProduct(id);
    showToast("Product deleted");
    load();
  };

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <span className="eyebrow">// Catalog</span>
          <h1 className="section-heading">Products ({products.length})</h1>
        </div>
        <Button to="/admin/products/new" variant="primary">
          + Add Product
        </Button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: 44 }}>
                      <ProductVisual category={p.category} sku={p.sku} size="sm" />
                    </div>
                    {p.name}
                  </div>
                </td>
                <td style={{ fontFamily: "var(--font-mono)" }}>{p.sku}</td>
                <td>{p.category}</td>
                <td>{formatCurrency(p.price)}</td>
                <td>{p.stock}</td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button to={`/admin/products/${p.id}/edit`} variant="secondary" size="sm">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(p.id, p.name)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
