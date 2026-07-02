// utils/emailService.js
const { Resend } = require("resend");

let resend;
function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️  RESEND_API_KEY is not set. Email sending will fail.");
      return null;
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

async function sendEmail({ to, subject, html }) {
  try {
    const client = getResendClient();
    if (!client) {
      throw new Error("Email service is not configured. Set RESEND_API_KEY in .env");
    }
    const response = await client.emails.send({
      from: "IFQE Portal <no-reply@vikasharma.online>",
      to,
      subject,
      html,
    });
    console.log("Response from Resend API received."); 

    // --- THIS IS THE CRITICAL FIX ---
    // If the response object from Resend contains an error property, it failed.
    if (response.error) {
      // We must THROW this error to make the Promise reject.
      throw new Error(response.error.message); 
    }
     
    // On success, just return the data part.
    return response.data;
  } catch (error) {
    // This will now catch both network errors and the error we just threw.
    console.error("sendEmail function failed:", error.message);
    // Rethrow to ensure the promise is rejected so the route handler knows it failed.
    throw error;
  }
}

module.exports = { sendEmail };