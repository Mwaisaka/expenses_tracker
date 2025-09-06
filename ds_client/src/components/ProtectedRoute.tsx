import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth();

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
