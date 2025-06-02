const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const assetRoutes = require("./routes/assetRoutes");
const requestRoutes = require("./routes/requestRoutes");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
// Auth routes
app.use("/api/auth", authRoutes);
// User routes
app.use("/api/users", userRoutes);
// Assets routes
app.use("/api/assets", assetRoutes);
// Request routes
app.use("/api/requests", requestRoutes);
// Report routes
app.use("/api/reports", require("./routes/reportRoutes.js"));
// Announcement routes
app.use("/api/announcements", require("./routes/announcementRoutes.js"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
