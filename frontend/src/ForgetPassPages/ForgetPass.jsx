import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ForgetPass() {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [message, setmessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await axios.post("http://localhost:5000/forgetpass", {
        email,
      });
      if (!data.data.msg) {
        setmessage("Your Email doesn't Exist");
      } else {
        localStorage.setItem("otoken", data.data.Otptoken);
        navigate("/otp");
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="forgot-container">
      <h1>Frogot Your Password</h1>
      <p>Enter your email address to receive a OTP and change your password.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
      <div>
        <p className="forget-msg">{message}</p>
      </div>
    </div>
  );
}

export default ForgetPass;
