import { useEffect, useState } from "react";

import axios from "axios";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
// Root Layout
import Layout from "./RootLayout/Layout.jsx";
import NavbarLayout from "./RootLayout/NavbarLayout.jsx";

// Registration Pages
import Register from "./RegistrationPage/Register.jsx";
import Login from "./RegistrationPage/Login.jsx";

// forget password pages
import ForgetPass from "./ForgetPassPages/ForgetPass.jsx";
import OtpPage from "./ForgetPassPages/OtpPage.jsx";
import ChangePass from "./ForgetPassPages/ChangePass.jsx";

// Welcome Page
import Home from "./Components/Home.jsx";
import Cart from "./Components/Cart.jsx";
import Contact from "./Components/Contact.jsx";
import Admin from "./Components/Admin.jsx";
import Comments from "./Components/Comments.jsx";
import Notfound from "./RootLayout/Notfound.jsx";

// Protect router
import Protect from "./Protect-route/Protect.jsx";

// Context
import ProductsProvider from "./Context/ProductsContext.jsx";
// Admin Page
import CreatePost from "./Components/AdminPage/CreatePost.jsx";
import DriversPage from "./Components/AdminPage/DriversPage.jsx";

// driver page
import Driver from "./Components/forDrivers/Driver.jsx";

function App() {
  const [products, setproducts] = useState([]);
  const [search, setsearch] = useState("");
  const [message, setmessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = (
          await axios.get(
            `http://localhost:5000/fetchProducts?search=${search}`,
          )
        ).data;
        if (data.message) {
          setmessage(data.message);
          setproducts([]);
        } else {
          setproducts(data);
          setmessage("");
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, [search]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="forgetPass" element={<ForgetPass />} />
        <Route path="otp" element={<OtpPage />} />
        <Route path="changePass" element={<ChangePass />} />

        <Route
          path="/welcome"
          element={
            <Protect>
              <NavbarLayout search={search} setsearch={setsearch} />
            </Protect>
          }
        >
          <Route path="Driver" element={<Driver />} />
          <Route index element={<Home />} />
          <Route path="home" element={<Home message={message} />} />
          <Route path="cart" element={<Cart />} />

          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />}>
            <Route path="CreatePost" element={<CreatePost />} />
            <Route path="DriversPage" element={<DriversPage />} />
          </Route>
          <Route path="comments" element={<Comments />} />
        </Route>
        <Route path="*" element={<Notfound />} />
      </Route>,
    ),
  );
  return (
    <div>
      <main>
        <ProductsProvider products={products}>
          <RouterProvider router={router} />
        </ProductsProvider>
      </main>
    </div>
  );
}

export default App;
