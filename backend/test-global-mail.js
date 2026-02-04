const { sendEmail } = require('./utils/mailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const sendExternalTest = async () => {
    // This is the target email (recipient). 
    // I am using a placeholder here, but in the app it will be the user's registered email.
    const recipient = 'suriyaaaat68@gmail.com';

    console.log(`[TEST] Sending email FROM suriyaaaat68@gmail.com TO ${recipient}...`);

    try {
        await sendEmail({
            to: recipient,
            subject: "Verification: System-Wide Transmission Power",
            text: `Success! CodeEvents is now configured to send all notifications FROM suriyaaaat68@gmail.com to any registered user.\n\nThis confirms the global uplink is active.\n\nSent from suriyaaaat68@gmail.com`,
            html: `
                <div style="font-family: 'Inter', sans-serif; padding: 40px; border: 1px solid #f0f0f0; border-radius: 20px; max-width: 600px; margin: auto;">
                    <div style="background: #000; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; margin-bottom: 20px;">CE</div>
                    <h2 style="font-family: serif; font-style: italic; font-size: 24px; color: #000;">Global Uplink Active</h2>
                    <p style="color: #666; line-height: 1.6;">Success! <strong>CodeEvents</strong> is now fully configured to transmit alerts from <code style="background: #f4f4f4; padding: 2px 6px; border-radius: 4px;">suriyaaaat68@gmail.com</code> to any email address registered on the network.</p>
                    <p style="color: #666; line-height: 1.6;">This verification message confirms the system-wide notification protocol is operational.</p>
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0f0f0; color: #999; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">
                        Sent from suriyaaaat68@gmail.com
                    </div>
                </div>
            `
        });
        console.log("[SUCCESS] Global transmission test complete!");
    } catch (error) {
        console.error("[FAILURE] Global transmission failed:", error.message);
    }
};

sendExternalTest();
