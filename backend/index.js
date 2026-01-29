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
app.use("/api/notes", require("./routes/Notes"));

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
