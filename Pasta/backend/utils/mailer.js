require("dotenv").config({ path: __dirname + '/../.env' });

const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

// ✅ Move log AFTER loading .env
console.log("Loaded EMAIL:", process.env.EMAIL);
console.log("Loaded PASS:", process.env.EMAIL_PASS ? "YES" : "NO");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMail(data) {
  const htmlContent = await ejs.renderFile(
    path.join(__dirname, "../views/receipt.ejs"),
    { data }
  );

  const mailOptions = {
    from: `"Anastasia Torten" <${process.env.EMAIL}>`,
    to: [data.email, process.env.EMAIL],
    subject: "Bestellbestätigung – Anastasia Torten",
    html: htmlContent
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendMail;
