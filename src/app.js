const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
connectDB();

//? Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const classScheduleRoutes = require("./routes/classSchedule.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();
app.use(express.json());

//? Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/schedules", classScheduleRoutes);
app.use("/bookings", bookingRoutes);

//? Health check route
app.get("/", (req, res) => res.send("Gym API Running"));

module.exports = app;
