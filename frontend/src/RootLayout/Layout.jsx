import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <div className="title">
        <h1>BuynMove</h1>
      </div>
      <header className="layout">
        <NavLink to="/">Register</NavLink>
        <NavLink to="/login">Login</NavLink>
        
      </header>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
