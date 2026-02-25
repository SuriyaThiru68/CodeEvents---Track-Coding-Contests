const Reminder = require('../models/Reminder');
const remindersRoute = require('../routes/reminders');

let running = false;

const startReminderWorker = (intervalMs = 30 * 1000) => {
    if (running) return;
    running = true;
    console.log('Reminder worker started — checking every', intervalMs / 1000, 'seconds');

    setInterval(async () => {
        try {
            const now = new Date();
            const due = await Reminder.find({ sent: false, sendAt: { $lte: now } }).limit(50);
            if (!due.length) return;

            for (const r of due) {
                try {
                    // Safety check: Skip if the scheduled time is more than 1 hour ago (stale catch-up)
                    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
                    if (new Date(r.sendAt) < oneHourAgo) {
                        console.log(`Skipping stale reminder for ${r.contest?.name} (scheduled for ${r.sendAt})`);
                        r.sent = true;
                        r.lastError = 'Auto-skipped: Past due threshold (stale)';
                        await r.save();
                        continue;
                    }

                    // sendReminderEmail is attached to the router file
                    if (typeof remindersRoute.sendReminderEmail === 'function') {
                        await remindersRoute.sendReminderEmail(r.email, r.contest);
                        r.sent = true;
                        r.sentAt = new Date();
                        r.attempts = (r.attempts || 0) + 1;
                        await r.save();
                        console.log('Reminder sent for', r.contest?.name, 'to', r.email);
                    } else {
                        console.warn('sendReminderEmail helper not available; skipping send for', r._id);
                    }
                } catch (err) {
                    r.attempts = (r.attempts || 0) + 1;
                    r.lastError = err?.message || String(err);
                    await r.save();
                    console.error('Failed to send reminder', r._id, err.message);
                }
            }
        } catch (err) {
            console.error('Reminder worker error', err.message);
        }
    }, intervalMs);
};

module.exports = { startReminderWorker };