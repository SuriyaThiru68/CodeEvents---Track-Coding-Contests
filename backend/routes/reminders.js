const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Simple reminder/email helper. If SMTP env vars are set, it will send via nodemailer.
// Otherwise it will log the payload (development fallback).
const sendEmailFallback = async ({ to, subject, text, html }) => {
    console.log('Reminder email payload (fallback, SMTP not configured):');
    console.log({ to, subject, text, html });
    return true;
};

const sendReminderEmail = async (email, contest) => {
    if (!email || !contest) throw new Error('Missing email or contest for sending reminder');

    // If SMTP configured, use nodemailer
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const subject = `Reminder: ${contest.name} on ${new Date(contest.date).toLocaleString()}`;
        const text = `Don't forget: ${contest.name} (${contest.platform}) starts at ${new Date(contest.date).toLocaleString()}\n\nLink: ${contest.url}`;
        const html = `<p>Don't forget: <strong>${contest.name}</strong> (${contest.platform}) starts at ${new Date(contest.date).toLocaleString()}</p><p><a href="${contest.url}">Open contest</a></p>`;

        await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: email, subject, text, html });
        return { msg: 'Reminder sent' };
    }

    // Fallback: log and return success
    await sendEmailFallback({ to: email, subject: `Reminder: ${contest.name}`, text: `Starts at ${contest.date}`, html: `<p>${contest.name}</p>` });
    return { msg: 'Reminder recorded (no SMTP configured)' };
};

// Make helper available to worker
router.sendReminderEmail = sendReminderEmail;

// Immediate send endpoint (keeps backwards compatibility)
router.post('/send', async (req, res) => {
    try {
        const { email, contest } = req.body;
        if (!email || !contest) {
            return res.status(400).json({ msg: 'Missing email or contest information' });
        }
        const result = await sendReminderEmail(email, contest);
        return res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Schedule endpoint — stores a reminder to be sent at contest.time - minutesBefore
router.post('/schedule', async (req, res) => {
    try {
        const { email, contest, minutesBefore = 10 } = req.body;
        if (!email || !contest || !contest.date) {
            return res.status(400).json({ msg: 'Missing email, contest, or contest.date' });
        }

        const contestDate = new Date(contest.date);
        const sendAt = new Date(contestDate.getTime() - Number(minutesBefore) * 60 * 1000);

        if (sendAt <= new Date()) {
            // send immediately if time has already passed
            const result = await sendReminderEmail(email, contest);
            return res.json({ msg: 'Sent immediately', detail: result });
        }

        const reminder = await Reminder.create({ email, contest, sendAt });
        return res.json({ msg: 'Reminder scheduled', scheduledAt: reminder.sendAt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;