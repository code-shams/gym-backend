const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

//? Health check route
app.get("/", (req, res) => res.send("Gym API Running"));

module.exports = app;
