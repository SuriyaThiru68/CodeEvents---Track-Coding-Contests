const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        console.log("REGISTER:", email);

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        console.log("LOGIN:", email);

        // Validation
        if (!email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET missing");
            return res.status(500).json({ msg: "Server configuration error" });
        }

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
