const ClassSchedule = require("../models/ClassSchedule");
const User = require("../models/User");

// Helper to validate HH:mm format
const isValidTime = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

// Convert "HH:mm" to minutes
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

//? Admin: Create Schedule
const createSchedule = async (req, res, next) => {
    try {
        const { date, startTime, endTime, trainer } = req.body;

        //? Validate time format
        if (!isValidTime(startTime) || !isValidTime(endTime)) {
            return res
                .status(400)
                .json({ message: "Invalid time format (HH:mm)" });
        }

        //? Ensure exactly 2-hour duration
        const newStart = timeToMinutes(startTime);
        const newEnd = timeToMinutes(endTime);
        if (newEnd - newStart !== 120) {
            return res
                .status(400)
                .json({ message: "Class duration must be exactly 2 hours" });
        }

        const trainerExists = await User.findById(trainer);
        if (!trainerExists || trainerExists.role !== "trainer") {
            return res.status(400).json({ message: "Invalid trainer ID" });
        }

        const schedulesCount = await ClassSchedule.countDocuments({ date });
        if (schedulesCount >= 5) {
            return res
                .status(400)
                .json({ message: "Max 5 schedules allowed per day" });
        }

        const overlappingSchedule = await ClassSchedule.findOne({
            trainer,
            date,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
            ],
        });

        if (overlappingSchedule) {
            return res.status(400).json({
                message: "Trainer already has a schedule at this time",
            });
        }

        //? Create schedule
        const schedule = await ClassSchedule.create({
            date,
            startTime,
            endTime,
            trainer,
        });

        res.status(201).json({ message: "Schedule created", schedule });
    } catch (err) {
        next(err);
    }
};

//? Trainer: View Their Schedules
const getTrainerSchedules = async (req, res, next) => {
    try {
        const trainerId = req.user.id; // from JWT middleware
        const schedules = await ClassSchedule.find({
            trainer: trainerId,
        }).populate("bookedTrainees", "name email");

        res.status(200).json({ schedules });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createSchedule,
    getTrainerSchedules,
};
