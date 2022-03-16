const router = require("express").Router();
const { requireLogin } = require("connect-mongo"); 
// is connect-mongo correct?
router.use(requireLogin);
const renderProfilePage = (req, res) => {
  res.render("profile", { user: req.session.currentUser });
};
router.get("/profile", renderProfilePage);

module.exports = router;

