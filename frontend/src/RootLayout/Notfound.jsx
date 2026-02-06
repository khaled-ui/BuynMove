import React from "react";

import { NavLink, Outlet } from "react-router-dom";
function Notfound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <NavLink to="/welcome/home">Go to the Home Page</NavLink>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Notfound;
