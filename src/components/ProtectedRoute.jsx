import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!session || session.role !== role) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/account"} replace />;
  }

  return children;
}
