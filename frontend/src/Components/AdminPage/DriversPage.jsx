import { useEffect, useState } from "react";
import axios from "axios";

function DriversPage() {
  const [orders, setorders] = useState("");
  const [sales, setsales] = useState("");
  const [revenue, setrevenue] = useState("");
  useEffect(() => {
    async function completedOrders() {
      try {
        const data = (await axios.get(`${process.env.REACT_APP_API_URL}/completedOrders`))
          .data;
        setorders(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    completedOrders();
    async function getsales() {
      try {
        const data = (await axios.get(`${process.env.REACT_APP_API_URL}/getsales`)).data;
        setsales(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    getsales();
    async function getrevenue() {
      try {
        const data = (await axios.get(`${process.env.REACT_APP_API_URL}/Revenue`)).data;
        setrevenue(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    getrevenue();
  }, []);

  return (
    <form>
      <h1>Drivers Page</h1>
      <div>
        <p>
          <strong>Driver 1</strong>
        </p>
        <p>
          Completed Orders:<strong>{orders}</strong>
        </p>
      </div>
      <div>
        <h1>Statistics</h1>
        <p>
          Total Sales: <strong>{sales}</strong>
        </p>
        <p>
          Revenue: <strong>{revenue}$</strong>
        </p>
      </div>
    </form>
  );
}

export default DriversPage;
