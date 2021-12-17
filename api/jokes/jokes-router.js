// do not make changes to this file
const router = require("express").Router();
const jokes = require("./jokes-data");

router.get("/", (req, res) => {
  try {
    res.status(200).json(jokes);
    if (!token) {
      next({ status: 401, message: "you are unauthorized" });
    }
  } catch (err) {
    next({  message: "you are unauthorized" });
  }
});

module.exports = router;
