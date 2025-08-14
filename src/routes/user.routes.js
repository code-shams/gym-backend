const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {
    res.json({ message: "Profile data", user: req.user });
});

module.exports = router;