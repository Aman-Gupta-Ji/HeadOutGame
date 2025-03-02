import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const toastShown = useRef(false);

  const pathname = location.pathname.split("/").pop();

  useEffect(() => {
    if (!isAuthenticated && !toastShown.current) {
      toast.warning(`You need to sign in to access ${pathname}!`);
      toastShown.current = true;
    }
  }, [isAuthenticated, pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}