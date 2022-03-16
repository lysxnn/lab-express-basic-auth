const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.session);
  console.log("Current User:", req.session.currentUser);
  res.render("index", { user: req.session.currentUser });
});

module.exports = router;
