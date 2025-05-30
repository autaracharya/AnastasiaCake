const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const generateOrderPDF = require("../utils/generatePDF");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

router.post("/", async (req, res) => {
  const data = req.body;



  const recipients = [process.env.EMAIL];
  if (data.email && data.email.includes("@")) {
    recipients.unshift(data.email);
  }
  
    // ✅ Ensure temp folder exists + generate PDF
  const tempFolder = path.join(__dirname, "../temp");
  if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder);
  }

  // ✅ Generate the PDF and save temporarily
  const pdfPath = path.join(__dirname, "../temp", `order-${Date.now()}.pdf`);
  await generateOrderPDF(data, pdfPath);

  const mailOptions = {
    from: `"Anastasia Torten" <${process.env.EMAIL}>`,
    to: recipients,
    subject: "Bestellbestätigung – Anastasia Torten",
    html: `
      <div style="font-family: 'Segoe UI', Quicksand, sans-serif; padding: 20px; max-width: 600px; margin: auto; background: #fff; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #600060;">🎂 Vielen Dank für Ihre Bestellung!</h2>
        <p><strong>Name:</strong> ${data.fullname || "–"}</p>
        <p><strong>Telefon:</strong> ${data.phone || "–"}</p>
        <p><strong>Datum:</strong> ${data.date || "–"}</p>
        <p><strong>Personen:</strong> ${data.guests || "–"}</p>
        <p><strong>Kategorie:</strong> ${data.category || "–"}</p>
        <p><strong>Nachricht:</strong><br>${data.message || "–"}</p>
      </div>
    `,
    attachments: [
      {
        filename: "Bestellung.pdf",
        path: pdfPath,
        contentType: "application/pdf"
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", recipients);
    fs.unlinkSync(pdfPath); // Clean up after sending
    res.status(200).send("Mail sent");
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    res.status(500).send("Mail failed");
  }
});

module.exports = router;
