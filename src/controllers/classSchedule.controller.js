const ClassSchedule = require("../models/ClassSchedule.model");
const User = require("../models/User.model");


//? Admin: Create Schedule
const createSchedule = async (req, res, next) => {
    try {
        const { date, startTime, endTime, trainer } = req.body;

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
            return res
                .status(400)
                .json({
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
