const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const userExists = await UserModel.exists({
      username: req.body.username,
    });
    console.log("User already exists", userExists);
    if (userExists) {
      res.render("signup", { error: "Username is already taken!" });
      return;
    }
    const { username, password } = req.body;
    const salt = await bcryptjs.genSalt(12);
    const hash = await bcryptjs.hash(password, salt);
    const newUser = {
      username,
      password: hash,
    };
    await UserModel.create(newUser);
    console.log(newUser);
    res.render("profile");
    // res.redirect("/login");
  } catch (err) {
    res.render("signup", { error: "Some kind of error occured." });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = await UserModel.findOne({ username: req.body.username });
    console.log("This is the User:", user);
    const hashFromDb = user.password;
    const passwordCorrect = await bcryptjs.compare(
      req.body.password,
      hashFromDb
    );
    console.log(passwordCorrect ? "Yes" : "No");
    if (!passwordCorrect) {
      throw Error("Password incorrect");
    }
    req.session.currentUser = user;
    res.redirect("/profile");
  } catch(err) {
    res.render("login", { error: "Wrong username or password" });
  }
});

router.get("/profile", (req, res) => {
  res.render("profile");
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

module.exports = router;
