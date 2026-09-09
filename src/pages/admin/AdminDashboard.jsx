import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import { formatCurrency, formatDate } from "../../utils/format";
import * as orderService from "../../services/orderService";
import * as productService from "../../services/productService";
import "../pages.css";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    orderService.getAllOrders().then(setOrders);
    productService.getAllProducts().then(setProducts);
  }, []);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock < 25).length;

  return (
    <div>
      <div className="section-header">
        <div>
          <span className="eyebrow">// Overview</span>
          <h1 className="section-heading">Dashboard</h1>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="toolbar__count">Total Orders</span>
          <span className="stat-card__value">{orders.length}</span>
        </div>
        <div className="stat-card">
          <span className="toolbar__count">Revenue</span>
          <span className="stat-card__value">{formatCurrency(revenue)}</span>
        </div>
        <div className="stat-card">
          <span className="toolbar__count">Products</span>
          <span className="stat-card__value">{products.length}</span>
        </div>
        <div className="stat-card">
          <span className="toolbar__count">Low Stock</span>
          <span className="stat-card__value">{lowStock}</span>
        </div>
      </div>

      <div className="admin-toolbar">
        <h3>Recent Orders</h3>
        <Link to="/admin/orders" style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)", textTransform: "uppercase" }}>
          View All →
        </Link>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customerName}</td>
                <td>{formatDate(o.date)}</td>
                <td>
                  <Badge variant="status">{o.status}</Badge>
                </td>
                <td>{formatCurrency(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
