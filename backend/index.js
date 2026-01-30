const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// Reminders / Notifications
app.use('/api/reminders', require('./routes/reminders'));

const PORT = 4000;
if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log(`Backend running on port ${PORT}`);
    });

    // Start reminder worker (background scheduler)
    try {
        const { startReminderWorker } = require('./utils/reminderWorker');
        startReminderWorker();
    } catch (err) {
        console.warn('Reminder worker not started:', err.message);
    }
}

module.exports = app;
