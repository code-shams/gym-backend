const User = require("../models/User");
const bcrypt = require("bcryptjs");

//? Admin creates a trainer
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

module.exports = { createUser, getAllTrainers };
