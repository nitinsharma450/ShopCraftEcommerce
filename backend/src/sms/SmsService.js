    import twilio from "twilio";
    import dotenv from 'dotenv'

    dotenv.config();
    const client = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);

    export const SmsService = {
    sendOrderSMS: async (toPhone, orderId) => {
        try {
        await client.messages.create({
            body: `🛍️ Thank you! Your order (${orderId}) has been placed successfully.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: toPhone
        });
        console.log("✅ SMS sent to", toPhone);
        } catch (err) {
        console.error("❌ SMS send error:", err);
        }
    }
    };
