import { Outlet, Navigate } from "react-router-dom";
import { auth } from "../firebase/Fire_Base";

const ProtectedRoutes = () => {
  // const isAuthenticated = true;

  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
   const user = auth.currentUser;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
