import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function OtpPage() {
  const navigate = useNavigate();
  const [first, setfirst] = useState("");
  const [second, setsecond] = useState("");
  const [third, setthird] = useState("");
  const [fourth, setfourth] = useState("");
  const [otp, setotp] = useState(localStorage.getItem("otoken"));
  const [message, setmessage] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await axios.post(`http://localhost:5000/verifyOtp`, {
        first,
        second,
        third,
        fourth,
        otp,
      });
      if (!data.data.success) {
        setmessage(data.data.msg || "OTP invalid");
        return;
      }
      localStorage.setItem("resetToken", data.data.resetToken);
      navigate("/changePass");

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Enter OTP</h2>
        <p>Please enter the 4-digit code</p>
        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            <input
              type="text"
              maxLength={1}
              value={first}
              onChange={(e) => setfirst(e.target.value)}
              required
            />
            <input
              type="text"
              maxLength={1}
              value={second}
              onChange={(e) => setsecond(e.target.value)}
              required
            />
            <input
              type="text"
              maxLength={1}
              value={third}
              onChange={(e) => setthird(e.target.value)}
              required
            />
            <input
              type="text"
              maxLength={1}
              value={fourth}
              onChange={(e) => setfourth(e.target.value)}
              required
            />
          </div>
          <button className="otps-btn" type="submit">
            Verify
          </button>
        </form>
        <p style={{ color: "red" }}>{message}</p>
      </div>
    </div>
  );
}

export default OtpPage;
