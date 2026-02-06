import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

function Driver() {
  const navigate = useNavigate();
  const [deleted, setdeleted] = useState(false);

  useEffect(() => {
    async function driver() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const data = await axios.get("http://localhost:5000/drivers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.data.user?.role !== "driver") {
          return navigate("/");
        }
      } catch (error) {
        console.error(error);
      }
    }
    driver();
  }, [navigate]);
  const [Orders, setOrders] = useState([]);

  async function DeliveredDone(product_id) {
    try {
      const data = await axios.delete("http://localhost:5000/delivered", {
        data: { product_id },
      });
      console.log(data);
      setOrders(Orders.filter((item) => item.id !== product_id));
      setdeleted(true);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function ReadOrders() {
      try {
        const data = (await axios.get("http://localhost:5000/getAddresess"))
          .data;
        setOrders(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    setInterval(ReadOrders, 10000);
    ReadOrders();
  }, []);
  return (
    <div className="Home-page">
      <div className="driver-container">
        <h1 className="driver-title">Driver 1</h1>
        <div>
          <h2 className="orders-title">Orders For You</h2>
          {Orders.map((item) => (
            <div key={item.id} className="order-card">
              <p className="order-name">{item.full_name}</p>
              <p className="order-phone">{item.phone_number}</p>
              <p className="order-address">{item.address}</p>
              <button
                className="delivered-btn"
                onClick={() => DeliveredDone(item.id)}
              >
                Delivered
              </button>
            </div>
          ))}
          {deleted ? (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              Delivered
            </Alert>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Driver;
