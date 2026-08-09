import { CircularProgress } from "@mui/material";
import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const LicenseGuard = (): ReactElement => {
  const { loading, licenseLoading, authenticated, licenseValid } = useAuth();

  if (loading || licenseLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!licenseValid) {
    return <Navigate to="/license-required" replace />;
  }

  return <Outlet />;
};
