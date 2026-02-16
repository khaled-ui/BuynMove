require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./DB/buynmove-db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./Auth/Authentication");
const nodemailer = require("nodemailer");
const { supabase } = require("./Supabase/supabase");
const multer = require("multer");
const axios = require("axios");
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  }),
);
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

function RandomNum() {
  const array = [];
  for (let index = 0; index < 4; index++) {
    const num = Math.floor(Math.random() * 10);
    array.push(num);
  }
  return array.join("");
}
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in km
}
app.get("/Revenue", async (req, res) => {
  try {
    const [data] = await db.query(
      "Select Sum(total_price) AS total_revenue from purchases",
    );
    res.json({ data: data[0].total_revenue });
  } catch (error) {
    console.error(error);
  }
});
app.get("/getsales", async (req, res) => {
  try {
    const [data] = await db.query(
      "SELECT COUNT(product_id) AS total_sales FROM purchases",
    );
    res.json({ data: data[0].total_sales });
  } catch (error) {
    console.error(error);
  }
});
app.get("/completedOrders", async (req, res) => {
  try {
    const [data] = await db.query("Select orders_delivered from drivers");
    res.json({ data: data[0].orders_delivered });
  } catch (error) {
    console.error(error);
  }
});

app.get("/drivers", auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error(error);
  }
});
app.delete("/delivered", async (req, res) => {
  const { product_id } = req.body;
  try {
    const [data] = await db.query("DELETE from addresses where id = ?", [
      product_id,
    ]);
    await db.query(
      "UPDATE drivers SET orders_delivered = orders_delivered + 1 WHERE id = 8",
    );
    res.json({ msg: true });
  } catch (error) {
    res.json({ msg: false });
    console.error(error);
  }
});

app.get("/getAddresess", async (req, res) => {
  try {
    const [data] = await db.query(
      "select id,full_name,phone_number,address from addresses where driver_id = 8",
    );
    res.json({ data, msg: true });
  } catch (error) {
    res.json({ msg: false });
    console.error(error);
  }
});

app.get("/Admin", auth, async (req, res) => {
  res.json({ user: req.user });
});

app.post("/createPost", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const { title, description, price } = req.body;
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILE:", req.file);

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Unique filename
    const fileName = `${Date.now()}-${file.originalname}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("Products")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      res.json({ success: false });
    }

    // Get public URL
    const { data } = supabase.storage.from("Products").getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    const [database] = await db.query(
      "INSERT INTO products (title, description, price, image_url) VALUES (?, ?, ?, ?)",
      [title, description, price, imageUrl],
    );

    res.json({
      success: true,
      imageUrl,
    });
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.json({ success: false, message: "Upload failed", error: err.message });
  }
});

app.get("/fetchComments", async (req, res) => {
  try {
    const [data] = await db.query("Select full_name,message from comments");
    res.json({ data, msg: true });
  } catch (error) {
    res.json({ msg: false });
    console.error(error);
  }
});

app.post("/Comments", auth, async (req, res) => {
  const { comment } = req.body;
  try {
    const [data] = await db.query(
      "Insert Into comments (user_id,full_name,message) VALUES (?,?,?)",
      [req.user.id, req.user.full_name, comment, req.user.full_name],
    );
    return res.json({ msg: true });
  } catch (error) {
    res.json({ msg: false });
    console.error(error);
  }
});

app.post("/contactUs", auth, async (req, res) => {
  const { email, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "khaledasfour531@gmail.com",
      pass: process.env.Mail_Password,
    },
  });

  try {
    const [data] = await db.query(
      "Insert Into contact_us ( user_id,email,message) VALUES (?,?,?)",
      [req.user.id, email, message],
    );
    await transporter.sendMail({
      from: "khaledasfour531@gmail.com",
      to: "khaledasfour531@gmail.com",
      replyTo: email,
      subject: "Message",
      text: `${message}`,
    });
    res.json({ msg: true });
  } catch (error) {
    res.json({ msg: false });
    console.error(error);
  }
});

app.post("/foraddress", auth, async (req, res) => {
  const { fullname, email, phoneNumber, address } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "khaledasfour531@gmail.com",
      pass: process.env.Mail_Password,
    },
  });
  try {
    const add = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "KhaledDeliveryApp/1.0 (khaledasfour531@gmail.com)",
      },
    });
    if (add.data.length === 0) {
      res.json({ msg: false });
    }
    const { lat, lon } = add.data[0];
    const latitude = parseFloat(add.data[0].lat);
    const longitude = parseFloat(add.data[0].lon);

    const [data] = await db.query(
      "Insert Into addresses (user_id,full_name,email,phone_number,address,latitude,longitude) values (?,?,?,?,?,?,?)",
      [req.user.id, fullname, email, phoneNumber, address, lat, lon],
    );

    const [driversdata] = await db.query(
      "Select id, latitude,longitude from drivers",
    );

    let nearestDriver = null;
    let minDistance = Infinity;

    driversdata.forEach((driver) => {
      const distance = haversine(
        lat,
        lon,
        parseFloat(driver.latitude),
        parseFloat(driver.longitude),
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestDriver = driver.id; // store the id
      }
    });

    await db.query("UPDATE addresses SET driver_id = ? WHERE id = ?", [
      nearestDriver,
      data.insertId,
    ]);

    const [driversemail] = await db.query(
      "SELECT u.email AS driver_email from addresses a JOIN drivers d ON a.driver_id = d.id JOIN users u ON d.user_id = u.id WHERE a.id = ?;",
      [data.insertId],
    );

    await transporter.sendMail({
      from: "khaledasfour531@gmail.com",
      to: driversemail[0].driver_email,
      subject: "Your Have An order",
      text: `You have an Order from ${fullname}`,
    });

    res.json({ msg: true });
  } catch (error) {
    res.json({ msg: false });
    console.error(error);
  }
});

app.post("/pay", auth, async (req, res) => {
  const { items } = req.body;
  const values = items.map((item) => {
    return [req.user.id, item.productID, item.quantity, item.price];
  });
  try {
    const [data] = await db.query(
      "Insert Into purchases (user_id,product_id,quantity,total_price) VALUES ?",
      [values],
    );
    res.json({ success: true, msg: "" });
  } catch (error) {
    res.json({ success: false, msg: "Your Cart Is Empty Now" });
    console.error(error);
  }
});

app.get("/fetchProducts", async (req, res) => {
  const { search } = req.query || "";
  try {
    const [data] = await db.query("Select * from products WHERE title LIKE ?", [
      `%${search}%`,
    ]);
    if (data.length === 0) {
      return res.json({ message: "No products found." });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error" });
  }
});

app.post("/updatePass", async (req, res) => {
  const { confirmPassword, resetToken } = req.body;
  if (!resetToken) return res.json({ msg: false });

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(confirmPassword, 10);
    const [data] = await db.query(
      "Update users set password = ? where email = ?",
      [hashed, decoded.email],
    );
    res.json({ msg: true });
  } catch (error) {
    console.error(error);
  }
});

app.post("/verifyOtp", async (req, res) => {
  const { first, second, third, fourth, otp } = req.body;
  if (!otp) {
    return res.json({ success: false, msg: "No OTP token provided" });
  }

  try {
    const decoded = jwt.verify(otp, process.env.JWT_SECRET);
    const join = first + second + third + fourth;
    if (decoded.otp !== join) {
      return res.json({ success: false, msg: "OTP does not match" });
    }

    const resetToken = jwt.sign(
      { email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" },
    );

    res.json({ success: true, resetToken });
  } catch (error) {
    console.error(error);
    res.json({ success: false, msg: "OTP invalid or expired" });
  }
});
app.get("/testdb", async (req, res) => {
  const [rows] = await db.query("SELECT COUNT(*) as total FROM users");
  res.json(rows);
});

app.post("/forgetpass", async (req, res) => {
  const { email } = req.body;
  const otp = RandomNum();

  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: "khaledasfour531@gmail.com",
  //     pass: process.env.Mail_Password,
  //   },
  // });

  try {
    const [data] = await db.query("SELECT email from users WHERE email = ?", [
      email,
    ]);
    if (data.length === 0) {
      return res.json({ msg: false });
    }

    // await transporter.sendMail({
    //   from: "khaledasfour531@gmail.com",
    //   to: email,
    //   subject: "Your OTP",
    //   text: `This is your OTP to change your Password "${otp}"`,
    // });

    await axios.post(
      `${process.env.MAILER_URL}/send-otp`,
      {
        to: email,
        otp,
      },
      {
        headers: {
          "x-mailer-key": process.env.MAILER_KEY,
        },
      },
    );

    const Otptoken = jwt.sign(
      { email: data[0].email, otp: otp },
      process.env.JWT_SECRET,
      { expiresIn: "3m" },
    );

    res.json({ msg: true, Otptoken });
  } catch (error) {
    res.json({ msg: false });
    console.error(error);
  }
});

app.get("/welcome", auth, (req, res) => {
  res.json({ msg: true, user: req.user });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [data] = await db.query(
      "SELECT id,email,password,full_name,role from users WHERE email = ?",
      [email],
    );
    if (data.length === 0) {
      return res.json({ msg: false });
    }
    ismatch = await bcrypt.compare(password, data[0].password);
    if (!ismatch) {
      return res.json({ msg: false });
    }

    const token = jwt.sign(
      {
        email: data[0].email,
        id: data[0].id,
        full_name: data[0].full_name,
        role: data[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ token, msg: true });
  } catch (error) {
    res.json({ msg: false });
    console.error(error);
  }
});

app.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const [data] = await db.query(
      "INSERT INTO users (full_name,email,password) VALUE (?,?,?)",
      [fullname, email, hash],
    );
    res.json({ msg: true });
  } catch (error) {
    res.json({ msg: false });
    console.error(error);
  }
});
app.get("/health", (req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log(`Server is working ${PORT}`);
});
