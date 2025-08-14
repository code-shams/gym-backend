const Booking = require("../models/Booking");
const ClassSchedule = require("../models/ClassSchedule");

//? Trainee: Book a Class
const bookClass = async (req, res, next) => {
    try {
        const traineeId = req.user.id; // From JWT middleware
        const { classScheduleId } = req.body;

        //? Check if class exists
        const schedule = await ClassSchedule.findById(classScheduleId);
        if (!schedule) {
            return res
                .status(404)
                .json({ message: "Class schedule not found" });
        }

        //? Check if trainee already booked this schedule
        const existingBooking = await Booking.findOne({
            trainee: traineeId,
            classSchedule: classScheduleId,
        });
        if (existingBooking) {
            return res
                .status(400)
                .json({ message: "You have already booked this class" });
        }

        //? Check if max 10 trainees reached
        if (schedule.bookedTrainees.length >= schedule.maxTrainees) {
            return res
                .status(400)
                .json({ message: "This class is fully booked" });
        }

        //? Create booking
        const booking = await Booking.create({
            trainee: traineeId,
            classSchedule: classScheduleId,
        });

        //? Add trainee to schedule's bookedTrainees
        schedule.bookedTrainees.push(traineeId);
        await schedule.save();

        res.status(201).json({ message: "Class booked successfully", booking });
    } catch (err) {
        next(err);
    }
};

//? Trainee: Cancel Booking
const cancelBooking = async (req, res, next) => {
    try {
        const traineeId = req.user.id;
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking || booking.trainee.toString() !== traineeId) {
            return res.status(404).json({ message: "Booking not found" });
        }

        //? Remove trainee from schedule's bookedTrainees
        const schedule = await ClassSchedule.findById(booking.classSchedule);
        schedule.bookedTrainees = schedule.bookedTrainees.filter(
            (id) => id.toString() !== traineeId
        );
        await schedule.save();

        //? Delete booking
        await booking.deleteOne();

        res.status(200).json({ message: "Booking canceled successfully" });
    } catch (err) {
        next(err);
    }
};

//? Trainee: View My Bookings
const getMyBookings = async (req, res, next) => {
    try {
        const traineeId = req.user.id;

        const bookings = await Booking.find({ trainee: traineeId }).populate(
            "classSchedule",
            "date startTime endTime trainer"
        );

        res.status(200).json({ bookings });
    } catch (err) {
        next(err);
    }
};

module.exports = { bookClass, cancelBooking, getMyBookings };
