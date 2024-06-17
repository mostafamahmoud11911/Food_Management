import { useAuth } from "../../../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProductedRoute({ children }) {
  const { loginUser } = useAuth();

  if (localStorage.getItem("token") || loginUser) {
    return children;
  }
  return <Navigate to="/login" />;
}
