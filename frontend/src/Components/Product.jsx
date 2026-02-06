import { useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { ProductsContext } from "../Context/ProductsContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function Product(props) {
  const { addtocart } = useContext(ProductsContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [Quantity, setQuantity] = useState();

  function handleSubmit(e) {
    e.preventDefault();
    addtocart( 
      props.id,
      props.title,
      props.image_url,
      props.price * Quantity,
      Number(Quantity),
    );
    setQuantity("");
  }

  return (
    <div>
      <div className="card-box">
        <form className="card" onSubmit={handleSubmit}>
          <img src={props.image_url} alt="perfume 1" loading="lazy" />
          <div className="card-container">
            <h2>{props.title}</h2>
            <div>
              <Button onClick={handleOpen}>See Details</Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Description
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {props.description}
                  </Typography>
                </Box>
              </Modal>
            </div>
            <p>{props.price}$</p>
          </div>
          <div>
            <input
              type="number"
              className="quantity"
              min="1"
              required
              value={Quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button type="submit" className="add-btn">
              Add to Cart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Product;
