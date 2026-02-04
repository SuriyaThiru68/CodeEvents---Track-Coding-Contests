const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { sendEmail } = require('../utils/mailer');

const sendReminderEmail = async (email, contest) => {
    if (!email || !contest) throw new Error('Missing email or contest for sending reminder');

    const subject = `Reminder: ${contest.name} on ${new Date(contest.date).toLocaleString()}`;
    const text = `Don't forget: ${contest.name} (${contest.platform}) starts at ${new Date(contest.date).toLocaleString()}\n\nLink: ${contest.url}\n\nSent from suriyaaaat68@gmail.com`;
    const html = `<p>Don't forget: <strong>${contest.name}</strong> (${contest.platform}) starts at ${new Date(contest.date).toLocaleString()}</p><p><a href="${contest.url}">Open contest</a></p><p style="color: #666; font-size: 12px; margin-top: 30px;">Sent from suriyaaaat68@gmail.com</p>`;

    await sendEmail({ to: email, subject, text, html });
    return { msg: 'Reminder processed' };
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

        // Send confirmation email
        try {
            await sendEmail({
                to: email,
                subject: `Alert Synced: ${contest.name}`,
                text: `Success! Your alert for ${contest.name} has been synced. We will remind you at ${sendAt.toLocaleString()}.\n\nSent from suriyaaaat68@gmail.com`,
                html: `<h3>Alert Synced Successfully</h3><p>Your alert for <strong>${contest.name}</strong> has been deployed.</p><p>We will send you a reminder at: <strong>${sendAt.toLocaleString()}</strong></p><p style="color: #666; font-size: 12px; margin-top: 30px;">Sent from suriyaaaat68@gmail.com</p>`
            });
        } catch (mailErr) {
            console.error("Failed to send scheduled confirmation email:", mailErr);
        }

        return res.json({
            msg: 'Reminder scheduled',
            detail: 'Initialization email sent to ' + email,
            scheduledAt: reminder.sendAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Test email endpoint
router.get('/test-email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const subject = "System Verification: Link Established";
        const text = `Success! Your email node (${email}) has been successfully linked to the CodeEvents ecosystem. You will receive notifications before your contests start.\n\nSent from suriyaaaat68@gmail.com`;
        const html = `
            <div style="font-family: serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h1 style="font-style: italic; color: #000;">Connection Verified</h1>
                <p>Success! Your email node (<strong>${email}</strong>) has been successfully linked to the <strong>CodeEvents</strong> ecosystem.</p>
                <p>You will receive notifications before your contests start at this address.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">Sent from suriyaaaat68@gmail.com</p>
            </div>
        `;

        await sendEmail({ to: email, subject, text, html });
        return res.json({ msg: 'Test email dispatched to ' + email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
