import React, { FC, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";

const ProtectedRoute: FC<{ children: React.ReactElement }> = ({ children }) => {
    const { token, expireTimestamp } = useContext(AuthContext);
    
    const expires = new Date(expireTimestamp).getTime();

    const isAuthorized = !!token && (expires > Date.now());
 
    if (!isAuthorized) {
        return <Navigate to="/login"/>
    }
    
    return children;
 };

export default ProtectedRoute;