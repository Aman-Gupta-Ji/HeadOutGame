import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const toastShown = useRef(false);

  const pathname = location.pathname.split("/").pop();

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !toastShown.current) {
      toast.warning(`You need to sign in to access ${pathname || 'this page'}!`);
      toastShown.current = true;
    }
  }, [isAuthenticated, pathname, isLoading]);

  // Show loading state if authentication status is being checked
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-headout-purple"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  // Render protected route content
  return <Outlet />;
}