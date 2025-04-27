const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes);


module.exports = app;