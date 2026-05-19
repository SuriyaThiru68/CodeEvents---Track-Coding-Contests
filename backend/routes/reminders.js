const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { sendEmail } = require('../utils/mailer');

// ── Shared HTML email template ─────────────────────────────────────────────
const buildEmailHtml = ({ title, subtitle, body, cta, ctaUrl, footer }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;overflow:hidden;border:1px solid rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:#000;padding:32px 40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#fff;border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;font-size:12px;font-weight:800;color:#000;padding:0 6px;">CE</td>
                  <td style="color:#fff;font-size:18px;font-weight:300;letter-spacing:-0.5px;padding-left:12px;">Code<strong>Events</strong></td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:48px 40px 32px;">
              <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(0,0,0,0.3);">${subtitle}</p>
              <h1 style="margin:0 0 24px;font-size:32px;font-weight:300;letter-spacing:-1px;color:#000;">${title}</h1>
              <div style="border-left:3px solid #000;padding-left:16px;margin-bottom:32px;color:rgba(0,0,0,0.6);font-size:14px;line-height:1.6;">
                ${body}
              </div>
              ${cta ? `<a href="${ctaUrl}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:14px 32px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${cta}</a>` : ''}
            </td>
          </tr>
          <!-- Divider -->
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid rgba(0,0,0,0.06);margin:0;" /></td></tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;font-size:10px;color:rgba(0,0,0,0.3);letter-spacing:1px;text-transform:uppercase;">
              ${footer || 'CodeEvents · Your Competitive Programming Hub'}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ── Send a scheduled reminder email (used by worker + immediate send) ───────
const sendReminderEmail = async (email, contest) => {
    if (!email || !contest) throw new Error('Missing email or contest for sending reminder');

    const contestDate = new Date(contest.date);
    const dateStr = contestDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = contestDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

    const subject = `⏰ Contest Reminder: ${contest.name}`;
    const text = `Your contest is starting soon!\n\n${contest.name} (${contest.platform})\nDate: ${dateStr}\nTime: ${timeStr}\n\nLink: ${contest.url}\n\n– CodeEvents`;
    const html = buildEmailHtml({
        title: 'Contest Starting Soon',
        subtitle: 'Reminder Alert',
        body: `
            <strong style="color:#000;">${contest.name}</strong><br/>
            Platform: ${contest.platform}<br/>
            Date: ${dateStr}<br/>
            Time: ${timeStr}
        `,
        cta: 'Open Contest',
        ctaUrl: contest.url || '#',
        footer: 'You are receiving this because you set a reminder on CodeEvents.'
    });

    await sendEmail({ to: email, subject, text, html });
    return { msg: 'Reminder processed' };
};

// Make helper available to worker
router.sendReminderEmail = sendReminderEmail;

// ── POST /api/reminders/send — Immediate send (also used for confirmation) ──
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

// ── POST /api/reminders/schedule — Schedule + instant confirmation email ────
router.post('/schedule', async (req, res) => {
    try {
        const { email, contest, minutesBefore = 10 } = req.body;
        if (!email || !contest || !contest.date) {
            return res.status(400).json({ msg: 'Missing email, contest, or contest.date' });
        }

        const contestDate = new Date(contest.date);
        const sendAt = new Date(contestDate.getTime() - Number(minutesBefore) * 60 * 1000);
        const dateStr = contestDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = contestDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
        const reminderTimeStr = sendAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

        if (sendAt <= new Date()) {
            // Send immediately if the reminder time has already passed
            const result = await sendReminderEmail(email, contest);
            return res.json({ msg: 'Sent immediately (contest is imminent)', detail: result });
        }

        // Save to DB
        const reminder = await Reminder.create({ email, contest, sendAt });

        // ── Instant confirmation email ──────────────────────────────────────
        try {
            const confirmSubject = `✅ Alert Confirmed: ${contest.name}`;
            const confirmText = `Your alert for "${contest.name}" has been set.\nWe will email you at ${reminderTimeStr} on ${dateStr}.\n\nContest link: ${contest.url}\n\n– CodeEvents`;
            const confirmHtml = buildEmailHtml({
                title: 'Alert Set Successfully',
                subtitle: 'Alert Confirmation',
                body: `
                    Your reminder for <strong style="color:#000;">${contest.name}</strong> has been activated.<br/><br/>
                    <strong>Platform:</strong> ${contest.platform}<br/>
                    <strong>Contest Date:</strong> ${dateStr}<br/>
                    <strong>Contest Time:</strong> ${timeStr}<br/>
                    <strong>You'll be reminded at:</strong> ${reminderTimeStr} (${minutesBefore} min before)
                `,
                cta: 'View Contest',
                ctaUrl: contest.url || '#',
                footer: 'You set this alert on CodeEvents. No action needed — we will remind you.'
            });

            await sendEmail({ to: email, subject: confirmSubject, text: confirmText, html: confirmHtml });
        } catch (mailErr) {
            console.error('[Reminders] Failed to send confirmation email:', mailErr.message);
        }

        return res.json({
            msg: 'Alert scheduled — confirmation email sent',
            detail: `Reminder will be sent at ${reminderTimeStr}`,
            scheduledAt: reminder.sendAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/reminders/test-email/:email ────────────────────────────────────
router.get('/test-email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const subject = '✔ System Verification: Link Established';
        const text = `Success! Your email (${email}) has been linked to CodeEvents. You will receive contest reminders here.\n\n– CodeEvents`;
        const html = buildEmailHtml({
            title: 'Connection Verified',
            subtitle: 'System Check',
            body: `Your email <strong style="color:#000;">${email}</strong> has been successfully linked to the <strong>CodeEvents</strong> ecosystem.<br/><br/>You will receive contest reminders and notifications at this address.`,
            footer: 'This was a test email sent from CodeEvents.'
        });

        await sendEmail({ to: email, subject, text, html });
        return res.json({ msg: 'Test email dispatched to ' + email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
