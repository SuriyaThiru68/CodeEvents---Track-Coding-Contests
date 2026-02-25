const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const Reminder = require('./models/Reminder');

async function clearReminders() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await Reminder.deleteMany({ sent: false });
        console.log(`Successfully cleared ${result.deletedCount} pending reminders.`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error clearing reminders:', err);
        process.exit(1);
    }
}

clearReminders();
