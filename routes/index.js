const express = require("express");
const routers = express.Router();

// user routes
routers.use("/user", require("./user"));

// room routes
routers.use("/room", require("./room"));

module.exports = routers;
