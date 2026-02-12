require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Multer handles uploads IN MEMORY (no disk files)
const upload = multer({ storage: multer.memoryStorage() });

app.post("/send-email", upload.single("attachment"), async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      description,
      inquiry,
      category,
      hear_about_us
    } = req.body;

    // 1️⃣ Nodemailer transporter (secure)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS  // from .env (App Password)
      }
    });

    // 2️⃣ Email sent to YOU (with file)
    const mailToYou = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVE_TO,
      replyTo: email,
      subject: `${inquiry} request from website - ${first_name} ${last_name}`,
      html: `
        <p><strong>Name:</strong> ${first_name} ${last_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${req.body.phone || "N/A"}</p>
        <p><strong>Inquiry Type:</strong> ${inquiry}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>How did you hear about us:</strong> ${hear_about_us || "N/A"}</p>
        <p><strong>Description:</strong><br>${description}</p>
      `,
      attachments: req.file
        ? [
            {
              filename: req.file.originalname,
              content: req.file.buffer
            }
          ]
        : []
    };

    // 3️⃣ Auto-reply to USER
    const autoReply = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "We Received Your Request",
      html: `
        <p>Hi ${first_name},</p>
        <p>Thank you for contacting <strong>Eyrie Contracting</strong>!<br>
        We have received your request and will respond within 24–48 hours.</p>
        <p>Best regards,<br>Eyrie Contracting</p>
      `
    };

    await transporter.sendMail(mailToYou);
    await transporter.sendMail(autoReply);

    res.json({ success: true, message: "Emails sent successfully!" });

  } catch (error) {
    console.error("Error sending email:", error);
    res.json({ success: false, error: "Email failed to send" });
  }
});

// For Render: listen on the correct port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
