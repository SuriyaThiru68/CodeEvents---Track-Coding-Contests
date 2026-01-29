const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashed });

        res.json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // Token expires in 1 day
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // 🔥 THIS LINE IS REQUIRED
