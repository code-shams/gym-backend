const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        trainee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        classSchedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ClassSchedule",
            required: true,
        },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;