import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";
function Login() {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [message, setmessage] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email,
        password,
      });
      console.log(data);
      if (!data.data.msg) {
        setmessage("Wrong Email or Password");
      } else {
        localStorage.setItem("token", data.data.token);
        navigate("/welcome");
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="log-container">
      <h2>Login</h2>
      <p className = 'log-msg'>{message}</p>
      <form className="log-form" onSubmit={handleSubmit}>
        <span>Email</span>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          required
        />
        <span>Password</span>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          required
        />
        <NavLink to="/forgetPass">Forgot your password?</NavLink>
        <button type="submit">Submit</button>
        
      </form>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Login;
