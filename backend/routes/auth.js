const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Registration attempt for:", email);

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", email);
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashed });
        console.log("User created successfully:", newUser.email);

        res.json({
            message: "User registered successfully",
            user: {
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);

        // Validation
        if (!email || !password) {
            console.log("Missing fields");
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        const user = await User.findOne({ email });
        console.log("User found:", user ? "Yes" : "No");

        if (!user) {
            console.log("User not found in DB");
            return res.status(400).json({ msg: "User does not exist" });
        }

        console.log("Checking password...");
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            console.log("Invalid credentials");
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        console.log("Signing JWT...");
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from environment variables!");
            throw new Error("Internal Server Error: JWT_SECRET is missing");
        }

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        console.log("Login successful");
        res.json({
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

module.exports = router; // 🔥 THIS LINE IS REQUIRED
