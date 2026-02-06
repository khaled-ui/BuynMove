import { createContext, useState, useEffect } from "react";
export const ProductsContext = createContext();
function ProductsProvider({ children, products }) {
  const [product, setproduct] = useState([] || products);
  const [cart, setcart] = useState([]);


  function clearcart(){
    setcart([])
  }

  function deleteItem(id) {
    setcart(
      cart.filter((item) => {
        return item.id !== id;
      }),
    );
  }

  function addtocart(id, title, image_url, price, quantity) {
    const find = cart.find((item) => item.id === id);
    if (find) {
      setcart(
        cart.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                price: item.price + price,
              }
            : item,
        ),
      );
    } else {
      setcart([...cart, { id, title, image_url, price, quantity }]);
    }
  }

  useEffect(() => {
    setproduct(products);
  }, [products]);

  return (
    <div>
      <ProductsContext.Provider value={{ product, addtocart, cart ,deleteItem,clearcart}}>
        {children}
      </ProductsContext.Provider>
    </div>
  );
}

export default ProductsProvider;
