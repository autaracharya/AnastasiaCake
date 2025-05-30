const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const orderRoutes = require("./routes/order");
require("dotenv").config();

console.log("Loaded EMAIL:", process.env.EMAIL);
console.log("Loaded PASS:", process.env.EMAIL_PASS ? "YES" : "NO");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../"))); // Serve your static site files

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/submit", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
