// utils/emailService.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html }) {
  try {
    const response = await resend.emails.send({
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