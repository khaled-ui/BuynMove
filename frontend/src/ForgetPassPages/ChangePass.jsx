import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function ChangePass() {
  const navigate = useNavigate();
  const [newPassword, setnewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [message, setmessage] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        setmessage("Passwords do not match");
      } else {
        const resetToken = localStorage.getItem("resetToken");

        const data = await axios.post(`http://localhost:5000/updatePass`, {
          confirmPassword,
          resetToken,
        });
        if (data.data.msg) {
          localStorage.removeItem("resetToken");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    async function fetchpage() {
      const resettoken = localStorage.getItem("resetToken");
      if (!resettoken) {
        navigate("/");
        return;
      }
    }
    fetchpage();
  }, [navigate]);
  return (
    <div className="changePassword-container">
      <h2>Change Your Password</h2>
      <p style={{ color: "red", textalign: "center" }}>{message}</p>
      <form className="changePassword-form" onSubmit={handleSubmit}>
        <span>New Password</span>
        <input
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setnewPassword(e.target.value)}
          required
        />
        <span>Confirm Password</span>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setconfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ChangePass;
