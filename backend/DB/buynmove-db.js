require("dotenv").config();
const mysql = require("mysql2");

const db = mysql
  .createConnection({
    host: process.env.Db_host,
    user: process.env.Db_user,
    password: process.env.Db_password,
    database: process.env.Db_database,
  })
  .promise();

db.connect((err) => {
  if (err) console.log("DB connection error:", err);
  else console.log("Connected to MySQL!");
});

module.exports = db;
