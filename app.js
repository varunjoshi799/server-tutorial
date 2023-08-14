const express = require("express");
const app = express();

// Import routes
const routes = require("./routes/routes")

// Body parser config
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register routes
app.use('/', routes)

module.exports = app;
