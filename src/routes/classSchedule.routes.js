const express = require("express");
const router = express.Router();

const {
    createSchedule,
    getTrainerSchedules,
} = require("../controllers/classSchedule.controller");

const verifyToken = require("../middlewares/auth.middleware");
const verifyRole = require("../middlewares/role.middleware");

//? Admin: Create Schedule
router.post("/", verifyToken, verifyRole("admin"), createSchedule);


//? Trainer: View Schedules
router.get("/my", verifyToken, verifyRole("trainer"), getTrainerSchedules);

module.exports = router;
