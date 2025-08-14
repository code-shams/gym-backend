const User = require("../models/User");
const bcrypt = require("bcryptjs");

//? Admin: create trainer
const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const role = "trainer";

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({ message: "Trainer created successfully", user });
    } catch (err) {
        next(err);
    }
};

//? Admin: Get all trainers
const getAllTrainers = async (req, res, next) => {
    try {
        const trainers = await User.find({ role: "trainer" }).select(
            "-password"
        );

        res.status(200).json({ trainers });
    } catch (err) {
        next(err);
    }
};

//? Admin: Update a trainer
const updateTrainer = async (req, res, next) => {
    try {
        const trainerId = req.params.id;
        const { name, email } = req.body;
        const trainer = await User.findById(trainerId);
        if (!trainer || trainer.role !== "trainer") {
            return res.status(404).json({ message: "Trainer not found" });
        }

        if (name) trainer.name = name;
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== trainerId) {
                return res
                    .status(400)
                    .json({ message: "Email already in use" });
            }
            trainer.email = email;
        }

        await trainer.save();

        res.status(200).json({
            message: "Trainer updated successfully",
            trainer: {
                _id: trainer._id,
                name: trainer.name,
                email: trainer.email,
                role: trainer.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

//? Admin: deleting a trainer
const deleteTrainer = async (req, res, next) => {
    try {
        const trainerId = req.params.id;
        const trainer = await User.findById(trainerId);
        if (!trainer || trainer.role !== "trainer") {
            return res.status(404).json({ message: "Trainer not found" });
        }
        await User.deleteOne({ _id: trainerId });

        res.status(200).json({ message: "Trainer deleted successfully" });
    } catch (err) {
        next(err);
    }
};

//? Trainee: update own profile
const updateProfile = async (req, res, next) => {
    try {
        const traineeId = req.user.id;
        const { name, email, password } = req.body;

        const trainee = await User.findById(traineeId);
        if (!trainee) {
            return res.status(404).json({ message: "Trainee not found" });
        }

        if (name) trainee.name = name;
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== traineeId) {
                return res
                    .status(400)
                    .json({ message: "Email already in use" });
            }
            trainee.email = email;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            trainee.password = hashedPassword;
        }

        await trainee.save();

        res.status(200).json({
            message: "Profile updated successfully",
            trainee: {
                _id: trainee._id,
                name: trainee.name,
                email: trainee.email,
                role: trainee.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createUser,
    getAllTrainers,
    updateTrainer,
    deleteTrainer,
    updateProfile,
};
