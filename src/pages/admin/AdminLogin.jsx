import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { ADMIN_DEMO_CREDENTIALS } from "../../utils/constants";
import "../pages.css";

export default function AdminLogin() {
  const { loginAdmin, session } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (session?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginAdmin(form);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div>
          <span className="eyebrow">// Admin Access</span>
          <h1 className="section-heading" style={{ fontSize: "1.6rem" }}>
            Sign In
          </h1>
        </div>
        <p className="demo-note">
          Demo access — not secure, for prototype only.
          <br />
          {ADMIN_DEMO_CREDENTIALS.email} / {ADMIN_DEMO_CREDENTIALS.password}
        </p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <Field label="Email" id="admin-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Field label="Password" id="admin-password" type="password" value={form.password} error={error} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button type="submit" variant="primary" full disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
