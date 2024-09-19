const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { createRoom, joinRoom } = require("../controllers/roomController");

// Middleware to authenticate JWT
function auth(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, "jwtSecret");
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

// Creating a room
router.post("/create-room", auth, createRoom);
// Joining a room
router.post("/join-room", auth, joinRoom);

module.exports = router;
