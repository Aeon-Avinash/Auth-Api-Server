const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.pre("save", async function(next) {
  const user = this;
  try {
    if (user.isModified("password")) {
      const salt = await bcrypt.genSalt(8);
      user.password = await bcrypt.hash(user.password, salt);
    }
    next();
  } catch (err) {
    return console.log(err);
  }
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userProfile = user.toObject();
  delete userProfile.password;
  delete userProfile.tokens;
  return userProfile;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  try {
    const token = await jwt.sign(
      { sub: user._id.toString(), iat: new Date().getTime() },
      process.env.JWT_SECRET
    );
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
  } catch (err) {
    return console.log(err);
  }
};

userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Unable to login!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Unable to login!");
    }
    return user;
  } catch (err) {
    return console.log(err);
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
