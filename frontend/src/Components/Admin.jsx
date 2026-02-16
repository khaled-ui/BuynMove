import { useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import axios from "axios";

function Admin() {
  const navigate = useNavigate();
  useEffect(() => {
    async function Admin() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const data = await axios.get(`http://localhost:5000/Admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.data.user?.role !== "admin") {
          return navigate("/welcome/home");
        }
      } catch (error) {
        console.error(error);
      }
    }
    Admin();
  }, [navigate]);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Admin Page</h1>
      <div className="cont-post">
        <div className="createpost">
          <NavLink to="CreatePost">Create Post</NavLink>
        </div>
        <div className="createpost">
          <NavLink to="DriversPage">Drivers Page</NavLink>
        </div>
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Admin;
