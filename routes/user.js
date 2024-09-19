const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/userController");

// Registring a user
router.post("/register", register);
// login a user
router.post("/login", login);

module.exports = router;
