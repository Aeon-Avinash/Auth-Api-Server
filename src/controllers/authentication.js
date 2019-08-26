const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(422)
        .send({ error: "You must provide email and password!" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(422).send({ error: "Email already in use!" });
    }
    const user = new User({ email, password });
    await user.save();
    const token = await user.generateAuthToken();
    // console.log(user);
    res.status(201).send({ success: true, user, token });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(422)
        .send({ error: "You must provide email and password!" });
    }
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    return res.status(200).send({ success: true, user, token });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.authWithToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.sub,
      "tokens.token": token
    });
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please Authenticate." });
  }
};
