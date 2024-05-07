import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import NavBar from "../components/NavBar";

const PrivateRoute = () => {
  const auth = useAuth();
  if (!auth.token) return <Navigate to="/login" />;
  return (
    <div className="Private">
      <NavBar />
      <div className="Outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateRoute;