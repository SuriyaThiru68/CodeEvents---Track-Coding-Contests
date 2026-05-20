const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profiles: {
        codeforces: { type: String, default: "" },
        leetcode: { type: String, default: "" },
        atcoder: { type: String, default: "" },
        codechef: { type: String, default: "" }
    },
    resetOtp: { type: String },
    resetOtpExpire: { type: Date },
    phoneNumber: { type: String, default: "" },
    alertPreference: { type: String, enum: ["email", "whatsapp", "both"], default: "email" }
});

module.exports = mongoose.model("User", userSchema);
