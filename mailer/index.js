require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.send("ok"));

app.post("/send-otp", async (req, res) => {
  const key = req.headers["x-mailer-key"];
  if (!key || key !== process.env.MAILER_KEY) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const { to, otp } = req.body;
  if (!to || !otp) {
    return res.status(400).json({ ok: false, error: "Missing to/otp" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: "Your OTP",
      text: `This is your OTP: "${otp}"`,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("MAIL ERROR:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Mailer running on", PORT));
