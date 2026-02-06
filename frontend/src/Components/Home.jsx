import { Outlet } from "react-router-dom";
import Product from "./Product";
import { useContext } from "react";
import { ProductsContext } from "../Context/ProductsContext";
export default function Home({ message }) {
  const { product } = useContext(ProductsContext);
  const prod = product.map((item) => {
    return <Product key={item.id} {...item} />;
  });
  return (
    <div className="Home-page">
      <div>
        <h1 className="home-Title"> BuynMove</h1>
        <div className="card-box">{prod}</div>
        <h3>{message}</h3>
      </div>
      <main>
        <Outlet />
      </main>
      <footer className="footer">Done By Khaled</footer>
    </div>
  );
}
