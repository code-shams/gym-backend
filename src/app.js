const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

//? Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const classScheduleRoutes = require("./routes/classSchedule.routes");
const bookingRoutes = require("./routes/booking.routes");

//? Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/schedules", classScheduleRoutes);
app.use("/bookings", bookingRoutes);

//? Middleware
const errorHandler = require("./middlewares/error.middleware");

//? Health check route
app.get("/", (req, res) => res.send("Gym API Running"));

//? Global error handler (must be last middleware)
app.use(errorHandler);

module.exports = app;
