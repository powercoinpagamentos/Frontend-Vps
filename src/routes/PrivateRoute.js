import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingAction from "../themes/LoadingAction/LoadingAction";

function PrivateRoute({ children, ...rest }) {
  const { authInfo, loading } = useContext(AuthContext);
  const { isAuthenticated } = authInfo;

  if (loading) {
    return <LoadingAction />;
  }
  if (isAuthenticated) {
    return children;
  }
  return (
    <Navigate
      to={
        authInfo?.dataUser?.key === "ADMIN" ? "/" : "/admin-sign-in"
      }
    />
  );
}

export default PrivateRoute;
