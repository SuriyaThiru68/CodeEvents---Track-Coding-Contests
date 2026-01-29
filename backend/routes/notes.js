const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/auth");

const router = express.Router();

// SAVE NOTE
router.post("/", auth, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ msg: "Please provide both title and content" });
        }

        const note = await Note.create({
            userId: req.user.id,
            title,
            content
        });

        res.json(note);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// GET NOTES
router.get("/", auth, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // 🔥 REQUIRED
