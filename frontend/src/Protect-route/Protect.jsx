import React from "react";
import { Navigate } from "react-router-dom";

function Protecttroot({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  } else {
    return children; 
  }
}

export default Protecttroot;