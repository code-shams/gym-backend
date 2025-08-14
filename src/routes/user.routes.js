const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const verifyRole = require("../middlewares/role.middleware");
const {
    createUser,
    getAllTrainers,
    updateTrainer,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {
    res.json({ message: "Profile data", user: req.user });
});

//? Admin-only: create a trainer
router.post("/", verifyToken, verifyRole("admin"), createUser);

//? Admin-only: get all trainers
router.get("/", verifyToken, verifyRole("admin"), getAllTrainers);

//? Admin-only: update trainer
router.put("/:id", verifyToken, verifyRole("admin"), updateTrainer);

module.exports = router;
