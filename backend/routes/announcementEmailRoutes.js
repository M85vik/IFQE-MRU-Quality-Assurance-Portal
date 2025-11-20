// Keep all your requires and initial setup the same
const express = require("express");
const router = express.Router();
const { sendEmail } = require("../utils/emailService");
const User = require("../models/User");
const Announcement = require("../models/Announcement");

// The refactored route handler
router.post("/send/:id", async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) return res.status(404).json({ message: "Announcement not found" });

        const users = await User.find({}, "email name");
        if (!users.length) return res.status(400).json({ message: "No users found" });

       const emailHTML = `
  <div style="
    font-family: 'Segoe UI', Tahoma, sans-serif;
    background: #eef2f7;
    padding: 35px 15px;
  ">
    <div style="
      max-width: 650px;
      margin: auto;
      background: #ffffff;
      border-radius: 14px;
      border: 1px solid #e3e8ef;
      padding: 35px 30px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    ">

      <!-- Header Section -->
      <div style="
        text-align: center;
        margin-bottom: 25px;
      ">
        <h1 style="
          font-size: 22px;
          font-weight: 700;
          margin: 0;
          color: #1a73e8;
          letter-spacing: -0.5px;
        ">
          📢 IFQE Portal Update
        </h1>
      </div>

      <!-- Title -->
      <h2 style="
        color: #111827;
        margin-bottom: 10px;
        font-size: 26px;
        font-weight: 600;
      ">
        ${announcement.title}
      </h2>

      <!-- Summary -->
      <p style="
        font-size: 16px;
        color: #374151;
        margin-bottom: 20px;
        line-height: 1.6;
      ">
        ${announcement.summary}
      </p>

      <!-- Details Block -->
      ${
        announcement.details
          ? `
          <div style="
            padding: 20px;
            background: #f3f7ff;
            border-left: 6px solid #1a73e8;
            border-radius: 8px;
            margin-bottom: 25px;
          ">
            <p style="
              margin: 0;
              color: #1f2937;
              font-size: 15px;
              line-height: 1.7;
            ">
              ${announcement.details}
            </p>
          </div>
        `
          : ""
      }

      <!-- Info Text -->
      <p style="
        margin-top: 10px;
        color: #4b5563;
        font-size: 14.5px;
        line-height: 1.7;
      ">
        This announcement was posted on the IFQE Portal.
        Log in anytime to explore more updates, deadlines, results, and system notifications.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 25px;">
        <a href="https://ifqe-mru-qa-portal.netlify.app" target="_blank" style="
          background: linear-gradient(90deg, #1a73e8, #2563eb);
          color: #ffffff;
          padding: 12px 26px;
          font-size: 15px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.3px;
          box-shadow: 0 3px 10px rgba(37, 99, 235, 0.25);
        ">
          Open IFQE Portal →
        </a>
      </div>

      <!-- Footer Divider -->
      <hr style="
        margin: 40px 0 20px;
        border: 0;
        border-top: 1px solid #e5e7eb;
      " />

      <!-- Footer -->
      <p style="
        color: #9ca3af;
        font-size: 12px;
        text-align: center;
        line-height: 1.6;
      ">
        © ${new Date().getFullYear()} IFQE Portal  
        <br/>Automated Announcement Delivery System
      </p>
    </div>
  </div>
`;

        console.log(`Starting to send ${users.length} emails in batches...`);
        let successfulEmails = 0;
        let failedEmails = 0;

        // --- Batching Logic ---
        const batchSize = 2; // Resend's rate limit per second
        const delay = 1100; // 1.1 seconds, a little buffer

        for (let i = 0; i < users.length; i += batchSize) {
            // Get a small chunk of users for the current batch
            const batch = users.slice(i, i + batchSize);
            console.log(`Processing batch #${(i / batchSize) + 1}... sending to ${batch.length} user(s).`);

            // Create the promise tasks for ONLY this batch
            const tasks = batch.map(user => sendEmail({
                to: user.email,
                subject: announcement.title,
                html: emailHTML,
            }));

            // Use Promise.allSettled on the small batch
            const results = await Promise.allSettled(tasks);

            // Check results for this batch
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    successfulEmails++;
                } else {
                    failedEmails++;
                    console.error(`Failed email in batch for ${batch[index].email}.`);
                }
            });

            // If there are more users left to process, PAUSE before the next batch
            if (i + batchSize < users.length) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        console.log(`Batch sending complete. Success: ${successfulEmails}, Failed: ${failedEmails}`);

        res.status(200).json({
            success: true,
            message: "Email sending process has finished.",
            data: {
                totalEmails: users.length,
                successful: successfulEmails,
                failed: failedEmails,
            },
        });

    } catch (err) {
        console.error("A critical error occurred in the send-announcement route:", err);
        res.status(500).json({ message: "An unexpected server error occurred." });
    }
});

module.exports = router;