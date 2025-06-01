const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function generateOrderPDF(data, outputPath) {
  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            padding: 20px;
            background: #fff8fb;
            color: #333;
          }
          h2 {
            color: #600060;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
          strong {
            color: #000;
          }
        </style>
      </head>
      <body>
        <h2>🎂 Vielen Dank für Ihre Bestellung!</h2>
        <p><strong>Name:</strong> ${data.fullname}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        <p><strong>Datum:</strong> ${data.date}</p>
        <p><strong>Personen:</strong> ${data.guests}</p>
        <p><strong>Kategorie:</strong> ${data.category}</p>
        <p><strong>Anlass:</strong> ${data.occasion}</p>
        <p><strong>Nachricht:</strong><br>${data.message || "–"}</p>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  await page.pdf({ path: outputPath, format: "A4", printBackground: true });
  await browser.close();
}

module.exports = generateOrderPDF;
