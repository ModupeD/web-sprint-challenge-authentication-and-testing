const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { tokenBuilder } = require("./auth-helpers");
const User = require("../middleware/users/users-model");

router.post("/register", async (req, res, next) => {
  //res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  try {
    // 1- pull u and p from req.body
    // 2- create a hash off of the password
    // 3- we will store u and hash to the db
    const { username, password } = req.body;
    console.log({ username, password });
    const newUser = {
      username,
      password: bcrypt.hashSync(password, 8), // 2^8 rounds
    };

    console.log({ newUser });
    if (!password || !username) {
      return next({ message: "username and password required" });
    }
    const created = await User.add(newUser);
    console.log({ created });

    res.status(201).json({ username: created.username, id: created.id });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
  try {
    // 1- pull u and p from req.body
    const { username, password } = req.body;
    console.log({ username, password });
    // 2- pull the user using the username
    const [userFromDb] = await User.findBy({ username });
    console.log({ userFromDb });
    if (!userFromDb) {
      return next({ message: "invalid credentials", status: 401 });
    }
    // 3- recreate the hash using password from req.body
    // 4- compare this agains the hash in the dabase
    const verifies = bcrypt.compareSync(password, userFromDb.password);
    if (!verifies) {
      return next({ message: "invalid credentials", status: 401 });
    }
    const token = tokenBuilder(userFromDb);
    res.json({
      message: `welcome, ${username}`,
      token,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
