import { useEffect, useState, useContext } from "react";
import { ProductsContext } from "../Context/ProductsContext";
import { NavLink, Outlet } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CommentIcon from "@mui/icons-material/Comment";

function NavbarLayout({ search, setsearch }) {
  const { cart } = useContext(ProductsContext);
  const [admin, setadmin] = useState(true);
  const [driver, setdriver] = useState(true);
  const [lengths, setlengths] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function ReadOrders() {
      try {
        const data = (await axios.get("http://localhost:5000/getAddresess"))
          .data;
        setlengths(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    setInterval(ReadOrders, 10000);
    ReadOrders();
  }, []);
  useEffect(() => {
    async function fetchpage() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const data = await axios.get("http://localhost:5000/welcome", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data.data.user?.role !== "admin") {
          setadmin(false);
        }
        if (data.data.user?.role !== "driver") {
          setdriver(false);
        }
        console.log(data);
      } catch (error) {
        navigate("/");
        console.error(error);
      }
    }
    fetchpage();
  }, [navigate]);
  function deletetoken() {
    localStorage.removeItem("token");
    navigate("/");
  }
  const style = {
    display: admin ? "block" : "none",
  };
  const styles = {
    display: driver ? "block" : "none",
  };
  return (
    <div className="navbar-container">
      <nav>
        <NavLink to="home">Logo</NavLink>
        <input id="nav-toggle" className="nav-toggle" type="checkbox" />
        <label
          htmlFor="nav-toggle"
          className="nav-burger"
          aria-label="Open menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </label>
        <div className="nav-links">
          <input
            className="nav-search"
            type="search"
            name="search"
            value={search}
            placeholder="Search"
            onChange={(e) => setsearch(e.target.value)}
          />
          <NavLink to="home">Home</NavLink>
          <NavLink to="Driver" style={styles}>
            Orders {lengths.length}
          </NavLink>
          <NavLink to="admin" style={style}>
            Admin
          </NavLink>
          <NavLink to="contact">Contact Us</NavLink>
          <NavLink to="/" onClick={deletetoken}>
            Logout
          </NavLink>
          <NavLink to="cart">
            <ShoppingCartIcon />
            {cart.length}
          </NavLink>
          <NavLink to="comments">
            <CommentIcon />
          </NavLink>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default NavbarLayout;
