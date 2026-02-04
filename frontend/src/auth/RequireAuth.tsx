import { Navigate, Outlet } from "react-router-dom";
import { getDemoUser } from "./demoAuth";

export default function RequireAuth() {
  const user = getDemoUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
