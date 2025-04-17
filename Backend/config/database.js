const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config(); // Load .env variables
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// To check the connection
db.getConnection()
  .then((connection) => {
    console.log("Connected to the database");
    connection.release();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

module.exports = db;