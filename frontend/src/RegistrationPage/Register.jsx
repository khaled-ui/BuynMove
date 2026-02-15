import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [message, setmessage] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        fullname,
        email,
        password,
      });
      if (!data.data.msg) {
        setmessage("Your Email Is Already Exist");
      } else {
        navigate("login");
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    setfullname("");
    setemail("");
    setpassword("");
  }
  return (
    <div className="reg-container">
      <h2>Register</h2>
      <p className = "reg-message">{message}</p>
      <form className="reg-form" onSubmit={handleSubmit}>
        <span>Full Name</span>
        <input
          type="text"
          name="fullname"
          value={fullname}
          onChange={(e) => setfullname(e.target.value)}
          required
        />
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Register;
