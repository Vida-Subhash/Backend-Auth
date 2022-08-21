require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const user = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser())
app.unsubscribe(express.json());
app.get("/", (req, res) => {
  res.send("Hello Subhash");
});

/**
 * @RegisterUser
 */
app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    // Check all the required fields are coming.
    if (!(email && password && firstname && lastname)) {
      res.status(400).send("All fields are required");
    }
    // Check if the user is already registered.
    const existingUser = await User.findOne({ email }); //PROMISE
    if (existingUser) {
      res.status(401).send("User already exists.");
    }

    const myEncPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: myEncPassword,
    });

    //token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    console.log("error", error);
  }
});
/**
 *
 */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Field is missing");
    }

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      user.password = undefined;
      res.status(200).json(user);

      // if you want to use cookies
      // const options = {
      //   expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      //   httpOnly: true,
      // };
      // res.status(200).cookie("token", token, options).json({
      //   sucesss: true,
      //   token,
      //   user
      // });
    } else {
      res.status(400).send("email or password is incorrect");
    }
  } catch (error) {
    console.log("error", error);
  }
});

/**
 * Dashboard
 */
app.get("/dashboard", auth, (req, res) => {
  res.send("secrate data");
});
module.exports = app;
