const { sendEmail } = require('./utils/mailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const sendSampleMail = async () => {
    // Target email provided by the user
    const targetEmail = 'kit27.am20@gmail.com';

    console.log(`[TEST] Sending sample mail to ${targetEmail}...`);

    try {
        await sendEmail({
            to: targetEmail,
            subject: "Sample Transmission - CodeEvents",
            text: `This is a sample alert message to verify your registry email.\n\nYou will receive notifications before your contests start at this email address.\n\nSent from suriyaaaat68@gmail.com`,
            html: `
                <div style="font-family: serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="font-style: italic; color: #000;">Sample Transmission</h1>
                    <p>This is a <strong>sample alert message</strong> to verify your registry email node.</p>
                    <p>You will receive notifications before your contests start at this email address.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">Sent from suriyaaaat68@gmail.com</p>
                </div>
            `
        });
        console.log("[SUCCESS] Sample mail sent successfully!");
    } catch (error) {
        console.error("[FAILURE] Could not send sample mail:", error.message);
    }
};

sendSampleMail();
