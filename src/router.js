const express = require("express");
const router = express.Router();

// const User = require("./models/user");
const Authentication = require("./controllers/authentication");

router.get("/", (req, res, next) => {
  res.send({ message: "API Server" });
});

router.post("/signup", Authentication.signup);

router.post("/signin", Authentication.signin);

router.get("/users/me", Authentication.authWithToken, (req, res) => {
  res.send(req.user);
});

router.post("/signout", Authentication.authWithToken, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = router;
