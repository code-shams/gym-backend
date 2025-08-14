const express = require("express");
const router = express.Router();

const {
    bookClass,
    cancelBooking,
    getMyBookings,
} = require("../controllers/booking.controller");

const verifyToken = require("../middlewares/auth.middleware");
const verifyRole = require("../middlewares/role.middleware");

//? Trainee: Book a Class
router.post("/", verifyToken, verifyRole("trainee"), bookClass);

//? Trainee: Cancel a Booking
router.delete("/:bookingId", verifyToken, verifyRole("trainee"), cancelBooking);

//? Trainee: View My Bookings
router.get("/my", verifyToken, verifyRole("trainee"), getMyBookings);

module.exports = router;
