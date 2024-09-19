const User = require("../models/user");
const bcrypt = require("bcryptjs"); // for password hashing
const jwt = require("jsonwebtoken");

// for registering new user
module.exports.register = async (req, res) => {
  // this code is run when the /register api is called as a post request
  // My req.body wil be of the format {username,password}
  const { username, password } = req.body;

  try {
    let user = new User({ username, password });
    await user.hashPassword();
    await user.save();
    res.status(201).send("User registered");
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// for login in the app
module.exports.login = async (req, res) => {
  //Step 1 : Get username and password sent by user from req.body
  const { username, password } = req.body;

  try {
    console.log(req.body);
    
    if (!username || !password) {
      return res
        .status(400)
        .json({ err: "Username and password are required" });
    }
    // check username exist or not
     const user = await User.findOne({ username });


    if (!user) {
      return res.status(403).json({ err: "Invalid Credentials" });
    }
    

    const isPasswordValid = await bcrypt.compare(password, user.password);
    // this will be true or false
    if (!isPasswordValid) {
      return res.status(403).json({ err: "Invalid Credentials" });
    }

    // If the credentials is correct return a token
    const token = jwt.sign({ id: user._id }, "jwtSecret", { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ err: "Server error, please try again later." });
  }
};
