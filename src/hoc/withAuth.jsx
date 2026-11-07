import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function withAuth(Component) {
  function Protected(props) {
    const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <Component {...props} />;
  }

  Protected.displayName = `withAuth(${Component.displayName || Component.name || "Page"})`;
  return Protected;
}