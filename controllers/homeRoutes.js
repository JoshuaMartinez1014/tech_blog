const router = require("express").Router();
const { User, BlogPost, Comment } = require("../models/index");
const withAuth = require("../utils/auth");

// takes you to the home page
router.get("/", async (req, res) => {
  const BlogPostData = await BlogPost.findAll({
    include: {
      model: User,
      attributes: ["name"],
    },
  });
  const BlogPosts = BlogPostData.map((BlogPostData) =>
    BlogPostData.get({ plain: true })
  );
  console.log(BlogPosts);
  res.render("insert", { logged_in: req.session.logged_in, BlogPosts });
});

// takes you to your dashboard
router.get("/dashboard", withAuth, async (req, res) => {
  const user = await User.findByPk(req.session.user_id);
  /* const userPosts = await User.getBlogPosts(req.session.user_id); */
  const userPosts = await BlogPost.findAll(
    {
      where: {
        user_id: req.session.user_id,
      },
    },
    {
      include: {
        model: User,
        attributes: ["name"],
      },
    }
  );
  const userPostFix = userPosts.map((userpost) =>
    userpost.get({ plain: true })
  );
  console.log(userPostFix);
  res.render("insert", { layout: "dashboard", user, userPostFix });
});

// dashboard new post form
router.get("/dashboard/new", async (req, res) => {
  res.render("newPost", { layout: "dashboard" });
});

// login page
router.get("/login", async (req, res) => {
  res.render("login", {
    layout: "dashboard",
    loginFailed: req.query?.login === "failed",
  });
});

// sign-up page
router.get("/signup", async (req, res) => {
  res.render("signup", { layout: "dashboard" });
});

// logout page
router.get("/logout", async (req, res) => {
  res.render("logout");
});

module.exports = router;
