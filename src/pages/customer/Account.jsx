import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { formatCurrency, formatDate } from "../../utils/format";
import { isRequired, isValidEmail } from "../../utils/validators";
import * as orderService from "../../services/orderService";
import "../pages.css";

function SignInForm() {
  const { loginCustomer } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email) || !isRequired(form.password)) {
      setError("Enter a valid email and password.");
      return;
    }
    await loginCustomer({ email: form.email });
    showToast("Signed in successfully");
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <Field label="Email" id="signin-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Field label="Password" id="signin-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={error} />
      <Button type="submit" variant="primary" full>
        Sign In
      </Button>
      <p className="demo-note">Static demo: any email/password combination signs you in.</p>
    </form>
  );
}

function RegisterForm() {
  const { registerCustomer } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isRequired(form.name) || !isValidEmail(form.email) || !isRequired(form.password)) {
      setError("Please fill in all fields with a valid email.");
      return;
    }
    await registerCustomer({ name: form.name, email: form.email });
    showToast("Account created — welcome!");
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <Field label="Full Name" id="reg-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Field label="Email" id="reg-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Field label="Password" id="reg-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={error} />
      <Button type="submit" variant="primary" full>
        Create Account
      </Button>
    </form>
  );
}

function CustomerDashboard() {
  const { session, logout } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.getOrdersByEmail(session.email).then(setOrders);
  }, [session.email]);

  return (
    <div className="container page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">// My Account</span>
          <h1 className="section-heading">Welcome back, {session.name}</h1>
        </div>
        <Button variant="ghost" onClick={logout}>
          Sign Out
        </Button>
      </div>

      <div className="account-grid">
        <div className="order-summary-card" style={{ position: "static" }}>
          <h4>Account Details</h4>
          <p style={{ color: "var(--color-text-muted)" }}>{session.name}</p>
          <p style={{ color: "var(--color-text-muted)" }}>{session.email}</p>
          <Button to="/wishlist" variant="secondary" size="sm">
            View Wishlist
          </Button>
        </div>

        <div>
          <h3 style={{ marginBottom: "16px" }}>Order History</h3>
          {orders.length === 0 ? (
            <div className="empty-state">
              <h3>No orders yet</h3>
              <p>Your placed orders will show up here.</p>
              <div style={{ marginTop: "16px" }}>
                <Button to="/shop" variant="primary">
                  Start Shopping
                </Button>
              </div>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const { isAuthenticated, isCustomer, session } = useAuth();
  const [tab, setTab] = useState("signin");

  if (isAuthenticated && isCustomer) {
    return <CustomerDashboard />;
  }

  if (isAuthenticated && session?.role === "admin") {
    return (
      <div className="container page-section">
        <p>You're signed in as an admin. Head to the <a href="/admin/dashboard" style={{ color: "var(--color-accent)" }}>admin dashboard</a>.</p>
      </div>
    );
  }

  return (
    <div className="container page-section auth-layout">
      <div className="section-header" style={{ display: "block", textAlign: "center" }}>
        <span className="eyebrow">// Account</span>
        <h1 className="section-heading">Sign In / Register</h1>
      </div>
      <div className="auth-tabs">
        <button data-active={tab === "signin"} onClick={() => setTab("signin")}>
          Sign In
        </button>
        <button data-active={tab === "register"} onClick={() => setTab("register")}>
          Register
        </button>
      </div>
      {tab === "signin" ? <SignInForm /> : <RegisterForm />}
    </div>
  );
}
