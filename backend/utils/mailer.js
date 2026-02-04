const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
    const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_SECURE } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        return null;
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT) || 587,
            secure: SMTP_SECURE === 'true',
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            },
            // Add some timeout settings
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 30000
        });
    }
    return transporter;
};

const sendEmail = async ({ to, subject, text, html }) => {
    const mailTransporter = getTransporter();
    const { SMTP_FROM, SMTP_USER } = process.env;

    if (mailTransporter) {
        try {
            console.log(`[MAILER] Dispatching email to ${to}...`);
            const info = await mailTransporter.sendMail({
                from: SMTP_FROM || SMTP_USER || '"CodeEvents" <noreply@codeevents.com>',
                to,
                subject,
                text,
                html
            });
            console.log('[MAILER] Success! MessageId:', info.messageId);
            return info;
        } catch (error) {
            console.error('[MAILER] Critical failure while sending email:');
            console.error(' - To:', to);
            console.error(' - Subject:', subject);
            console.error(' - Error:', error.message);
            console.error(' - Code:', error.code);
            throw error;
        }
    }

    // Fallback if environment variables are missing
    console.warn('[MAILER] WARNING: SMTP variables are missing. Logging to console instead.');
    console.log('--- EMAIL LOG START ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', text);
    console.log('--- EMAIL LOG END ---');
    return { msg: 'Logged (no SMTP configured)' };
};

module.exports = { sendEmail };
