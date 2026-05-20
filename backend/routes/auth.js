const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../utils/mailer");
const auth = require("../middleware/auth");

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

        // Send Welcome Email
        try {
            await sendEmail({
                to: newUser.email,
                subject: "Welcome to CodeEvents!",
                text: `Hi ${newUser.name},\n\nYou have successfully registered to CodeEvents. You will receive notifications before your contests start at this email address.\n\nSent from suriyaaaat68@gmail.com`,
                html: `<h1>Welcome to CodeEvents!</h1><p>Hi <strong>${newUser.name}</strong>,</p><p>You have successfully registered to <strong>CodeEvents</strong>. You will receive notifications before your contests start at this email address.</p><p style="color: #666; font-size: 12px; margin-top: 30px;">Sent from suriyaaaat68@gmail.com</p>`
            });
        } catch (mailErr) {
            console.error("Failed to send welcome email:", mailErr);
        }

        return res.status(201).json({
            message: "User registered successfully",
            detail: "A welcome email has been sent to your registry email.",
            user: {
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber || "",
                alertPreference: newUser.alertPreference || "email",
                profiles: newUser.profiles || {}
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
                email: user.email,
                phoneNumber: user.phoneNumber || "",
                alertPreference: user.alertPreference || "email",
                profiles: user.profiles || {}
            }
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});

/* =========================
   FORGOT PASSWORD - SEND OTP
========================= */
router.post("/forgot-password-otp", async (req, res) => {
    try {
        const { email } = req.body || {};

        console.log("FORGOT PASSWORD OTP:", email);

        if (!email) {
            return res.status(400).json({ msg: "Please provide your email address" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User with this email does not exist" });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date();
        otpExpire.setMinutes(otpExpire.getMinutes() + 10); // 10 minutes expiry

        user.resetOtp = otp;
        user.resetOtpExpire = otpExpire;
        await user.save();

        // Send Email
        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset OTP for CodeEvents",
                text: `Hi ${user.name},\n\nYour OTP to reset password is: ${otp}\nThis OTP is valid for 10 minutes.\n\nCodeEvents Team`,
                html: `<h1>Password Reset</h1><p>Hi <strong>${user.name}</strong>,</p><p>Your OTP to reset your password is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p><p style="color: #666; font-size: 12px; margin-top: 30px;">CodeEvents Team</p>`
            });
        } catch (mailErr) {
            console.error("Failed to send reset email:", mailErr);
            return res.status(500).json({ msg: "Failed to send reset email" });
        }

        return res.json({ msg: "An OTP has been sent to your email." });
    } catch (err) {
        console.error("FORGOT PASSWORD OTP ERROR:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});

/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password-otp", async (req, res) => {
    try {
        const { email, otp, password } = req.body || {};

        if (!email || !otp || !password) {
            return res.status(400).json({ msg: "Please provide email, OTP, and new password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email" });
        }

        if (user.resetOtp !== otp || !user.resetOtpExpire || user.resetOtpExpire < new Date()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.resetOtpExpire = undefined;
        await user.save();

        return res.json({ msg: "Password has been successfully reset. You can now login." });
    } catch (err) {
        console.error("RESET PASSWORD ERROR:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});

/* =========================
   UPDATE PROFILES
========================= */
router.put("/profiles", auth, async (req, res) => {
    try {
        const { profiles } = req.body;
        if (!profiles) {
            return res.status(400).json({ msg: "Profiles data missing" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        user.profiles = { ...user.profiles, ...profiles };
        await user.save();

        return res.json({ profiles: user.profiles });
    } catch (err) {
        console.error("UPDATE PROFILES ERROR:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});

/* =========================
   UPDATE PREFERENCES
========================= */
router.put("/preferences", auth, async (req, res) => {
    try {
        const { phoneNumber, alertPreference, name } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (alertPreference !== undefined) user.alertPreference = alertPreference;
        if (name !== undefined) user.name = name;

        await user.save();

        return res.json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber || "",
                alertPreference: user.alertPreference || "email",
                profiles: user.profiles || {}
            }
        });
    } catch (err) {
        console.error("UPDATE PREFERENCES ERROR:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
