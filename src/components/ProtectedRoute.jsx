import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireOwner = false }) {
  const { user, isOwner } = useAuth();

  // Not signed in? go login
  if (!user) return <Navigate to="/login" replace />;

  // TEMP: allow everyone to pass owner check while wiring roles
  const ownerOK = typeof isOwner === "boolean" ? isOwner : true;

  if (requireOwner && !ownerOK) {
    // You can send them somewhere else (e.g., a "Become a host" page)
    return <Navigate to="/" replace />;
  }

  return children;
}
