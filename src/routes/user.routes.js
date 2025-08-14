const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const verifyRole = require("../middlewares/role.middleware");
const {
    createUser,
    getAllTrainers,
    updateTrainer,
    deleteTrainer,
    updateProfile,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {
    res.json({ message: "Profile data", user: req.user });
});

//? Trainee: update own profile
router.put("/profile", verifyToken, verifyRole("trainee"), updateProfile);

//? Admin: create a trainer
router.post("/", verifyToken, verifyRole("admin"), createUser);

//? Admin: get all trainers
router.get("/", verifyToken, verifyRole("admin"), getAllTrainers);

//? Admin: update trainer
router.put("/:id", verifyToken, verifyRole("admin"), updateTrainer);

//? Admin: delete trainer
router.delete("/:id", verifyToken, verifyRole("admin"), deleteTrainer);

module.exports = router;
