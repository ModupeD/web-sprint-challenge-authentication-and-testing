// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const router = require("express").Router();
const { restricted } = require("../restricted");
const User = require("./users-router");
/**
  [GET] /api/users

  This endpoint is sRESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */
router.get("/users", restricted, async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;
