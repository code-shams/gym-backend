const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role }, // payload
        process.env.JWT_SECRET, // secret key
        { expiresIn: "1d" } // token lifespan
    );
};

module.exports = generateToken;
