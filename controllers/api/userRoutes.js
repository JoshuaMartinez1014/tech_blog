const router = require("express").Router();
const { User, BlogPost } = require("../../models");

//      /api/

//  Signup
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      console.log(userData);
      res.redirect("/");
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      /* res.json({ user: userData, message: "You are now logged in!" }); */
      res.redirect("/");
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  console.log({ loggedIn: req.session.logged_in });
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).redirect("/");
    });
  } else {
    res.status(204).redirect("/");
  }
});

// create new blogpost
// api/users/dashboard/new
router.post("/dashboard/new", async (req, res) => {
  try {
    const { title, description } = req.body;
    const user_id = req.session.user_id;
    const newPost = await BlogPost.create({
      title: title,
      description: description,
      user_id: user_id,
    });
    console.log({ newPost: newPost });
    res.redirect("/dashboard");
  } catch (err) {
    console.log({ error: err });
  }
});

module.exports = router;
