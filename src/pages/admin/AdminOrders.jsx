import { useEffect, useState } from "react";
import Badge from "../../components/ui/Badge";
import { formatCurrency, formatDate } from "../../utils/format";
import { ORDER_STATUSES } from "../../utils/constants";
import { useToast } from "../../context/ToastContext";
import * as orderService from "../../services/orderService";
import "../pages.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    orderService.getAllOrders().then(setOrders);
  }, []);

  const handleStatusChange = async (id, status) => {
    await orderService.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    showToast(`Order ${id} marked as ${status}`);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <span className="eyebrow">// Fulfillment</span>
          <h1 className="section-heading">Orders ({orders.length})</h1>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={{ fontFamily: "var(--font-mono)" }}>{o.id}</td>
                <td>
                  {o.customerName}
                  <br />
                  <span style={{ color: "var(--color-text-faint)", fontSize: "0.75rem" }}>{o.email}</span>
                </td>
                <td>{formatDate(o.date)}</td>
                <td>{o.items.reduce((s, i) => s + i.qty, 0)} items</td>
                <td>{formatCurrency(o.total)}</td>
                <td>
                  <select className="status-select" value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}>
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <div style={{ marginTop: "6px" }}>
                    <Badge variant="status">{o.status}</Badge>
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
