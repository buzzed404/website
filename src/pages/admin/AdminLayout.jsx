import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../pages.css";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="site-header__logo" style={{ fontSize: "1.1rem" }}>
          BUZZ<span style={{ color: "var(--color-accent)" }}>ED</span>.404
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--color-text-faint)", marginLeft: 6 }}>ADMIN</span>
        </div>
        <nav>
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            style={{ background: "none", border: "none", textAlign: "left", padding: "12px 12px", fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)", textTransform: "uppercase", color: "var(--color-error)" }}
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
