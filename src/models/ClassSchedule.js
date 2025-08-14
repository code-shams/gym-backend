const mongoose = require("mongoose");

const classScheduleSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String, // e.g., "10:00"
            required: true,
        },
        endTime: {
            type: String, // e.g., "12:00"
            required: true,
        },
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to User model
            required: true,
        },
        maxTrainees: {
            type: Number,
            default: 10,
        },
        bookedTrainees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Trainee IDs
            },
        ],
    },
    { timestamps: true }
);

const ClassSchedule = mongoose.model("ClassSchedule", classScheduleSchema);
module.exports = ClassSchedule;
