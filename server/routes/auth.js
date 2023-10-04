const router = require("express").Router();
const User = require("../models/User");
const Guest = require("../models/Guest");
const bcrypt = require("bcrypt");

//jwt
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user to database and return response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // No user found
      return res.status(404).json("Wrong credentials"); // Change the message
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      // Wrong password
      return res.status(400).json("Wrong credentials"); // Change the message
    }

    // Valid credentials
    user.isOnline = true;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGOUT
router.post("/logout", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body._id });

    //valid credentials (return user)
    //set online status - update and save document
    user.isOnline = false;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GUEST-LOGIN
router.post("/login/guest", async (req, res) => {
  try {
    const guest = await Guest.findOne({ email: req.body.email });

    if (!guest) {
      // No guest found
      return res.status(404).json("Wrong credentials");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      guest.password
    );

    if (!validPassword) {
      // Wrong password
      return res.status(400).json("Wrong credentials");
    }

    // Valid credentials
    res.status(200).json(guest);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN JWT (generacja tokena przy logowaniu) --- do podmianki w tutorialu
router.post("/login/jwt", async (req, res) => {
  try {
    //wrong email
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("user not found"); //change_to: wrong credentials

    //wrong password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password"); //change_to: wrong credentials

    //valid credentials (return user)
    //const token = jwt.sign({userId:req.body.userId},process.env.JWT_SERVER_KEY,{expiresIn:'1h'});
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SERVER_KEY, {
      expiresIn: "1h",
    });

    const userWithToken = { ...user.toObject(), jwt: token };
    res.status(200).json(userWithToken);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GUEST-LOGIN JWT (generacja tokena przy logowaniu dla gościa)
router.post("/login/guest-jwt", async (req, res) => {
  try {
    //wrong email
    const guest = await Guest.findOne({ email: req.body.email });
    !guest && res.status(404).send("guest not found");

    //wrong password
    const validPassword = await bcrypt.compare(
      req.body.password,
      guest.password
    );
    !validPassword && res.status(400).json("wrong password");

    //valid credentials (return guest)
    const token = jwt.sign({ guestId: guest._id }, process.env.JWT_SERVER_KEY, {
      expiresIn: "1h",
    });

    const guestWithToken = { ...guest.toObject(), jwt: token };
    res.status(200).json(guestWithToken);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
