require("dotenv").config();
const connectDB = require("./src/config/db");
const express = require("express");
const app = require("./src/app");

app.use(express.static("./public"));

connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
