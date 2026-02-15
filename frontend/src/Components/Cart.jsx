import { Outlet } from "react-router-dom";
import { ProductsContext } from "../Context/ProductsContext";
import { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function Cart() {
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [address, setaddress] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { cart, deleteItem, clearcart } = useContext(ProductsContext);
  const [message, setmessage] = useState("");
  const [alert, setalert] = useState(false);

  async function sendAddress() {
    try {
      const token = localStorage.getItem("token");
      const data = axios.post(
        `${process.env.REACT_APP_API_URL}/foraddress`,
        { fullname, email, phoneNumber, address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!data.data.msg) {
        setmessage("Your Address Is Wrong");
      }

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  async function handleSubmit(e) {
    try {
      const items = cart.map((item) => {
        return {
          productID: item.id,
          quantity: item.quantity,
          price: item.price,
        };
      });
      const token = localStorage.getItem("token");

      const data = await axios.post(
        `${process.env.REACT_APP_API_URL}/pay`,
        { items },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!data.data.success) {
        setmessage(data.data.msg);
      } else {
        setalert(true);
        clearcart();
        setfullname("");
        setemail("");
        setphoneNumber("");
        setaddress("");
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  const data = cart.map((item) => {
    return (
      <div className="product-card-horizontal" key={item.id}>
        <img
          src={item.image_url}
          alt="Perfume 1"
          className="product-image-horizontal"
          loading="lazy"
        />
        <div className="product-info-horizontal">
          <h2 className="product-title">{item.title}</h2>
          <p className="product-quantity">Quantity: {item.quantity}</p>
          <p className="product-price">{item.price} $</p>
          <button
            type="button"
            className="delete-btn"
            onClick={(e) => {
              e.preventDefault();
              deleteItem(item.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="Home-page">
      <div className="cart-table">
        <h1>Your Cart</h1>
        <div className="cart-box">
          {data.length === 0 ? (
            <h4 style={{ color: "red" }}>Your Cart Is Empty Now</h4>
          ) : (
            data
          )}
          <button className="pay-btn" type="submit" onClick={handleOpen}>
            Pay
          </button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await sendAddress();
                    await handleSubmit();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                <Typography variant="h2" color="initial">
                  Your Location
                </Typography>

                <span>Full Name</span>
                <br />
                <input
                  type="text"
                  name="fullName"
                  onChange={(e) => setfullname(e.target.value)}
                  value={fullname}
                  required
                />
                <br />
                <span>Email Address</span>
                <br />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  required
                />
                <br />
                <span>Phone Number</span>
                <br />
                <input
                  type="text"
                  name="PhoneNumber"
                  onChange={(e) => setphoneNumber(e.target.value)}
                  value={phoneNumber}
                  required
                />
                <br />
                <span>Location (Beirut, Mount Lebanon, Baalbek, Tripoli)</span>
                <br />
                <input
                  type="text"
                  name="address"
                  onChange={(e) => setaddress(e.target.value)}
                  value={address}
                  required
                />
                <br />
                {data.length > 0 ? (
                  <button type="submit">Submit</button>
                ) : (
                  <p style={{ textAlign: "center" }}>Your Cart Is Empty Now</p>
                )}
                {alert ? (
                  <Alert variant="filled" severity="success">
                    Success
                  </Alert>
                ) : (
                  <div>{message}</div>
                )}
              </form>
            </Box>
          </Modal>
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Cart;
