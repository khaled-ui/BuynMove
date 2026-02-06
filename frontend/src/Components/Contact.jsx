import { useState } from "react";
import axios from "axios";

function Contact() {
  const [email, setemail] = useState("");
  const [message, setmessage] = useState("");
  const [response, setresponse] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const data = await axios.post(
        "http://localhost:5000/contactUs",
        { email, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!data.data.msg) {
        setresponse("Try Again");
      } else {
        setresponse("Thank You For Your Message");
      }
      setemail("")
      setmessage("")
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="contact">
      <h1 className="contact-title">Contact Us</h1>

      <form className="contact-form" onSubmit={handleSubmit}>
        <span>Email</span>
        <input
          type="email"
          name="email"
          onChange={(e) => setemail(e.target.value)}
          value={email}
          required
        />

        <span>Message</span>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setmessage(e.target.value)}
          required
        ></textarea>

        <button type="submit">Send</button>
      </form>

      <p style = {{textAlign : "center"}}>{response}</p>
    </div>
  );
}

export default Contact;
