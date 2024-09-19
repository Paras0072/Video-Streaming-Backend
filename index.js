// npm init : package.json - This is a node project
// npm i express : expressJs package get install - project came to know that we are using express
// We finally use express
// server.js
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");

// for accessing env files
require("dotenv").config();

// Express setup
const app = express();

// port for server
const port = process.env.PORT || 5000;
// MongoDB connection
const db = require("./config/mongoose");

// Middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.use(express.json());

// using express routers
app.use(require("./routes"));

app.use(bodyParser.json());

// Start server
// Now we want to tell express that our server will run on localhost:5000
server.listen(port, () => {
 console.log(`Server running on port ${port}`);
});

