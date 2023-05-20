const router = require("express").Router();
const { User, BlogPost, Cart } = require("../models/index");
const withAuth = require("../utils/auth");

// takes you to the home page
router.get("/", async (req, res) => {
  res.render("insert", { logged_in: req.session.logged_in });
});

router.get("/dashboard", withAuth, async (req, res) => {
  const user = await User.findByPk(req.session.user_id);
  /* const userPosts = await User.getBlogPosts(req.session.user_id); */
  const userPosts = await Cart.findAll({
    where: {
      user_id: req.session.user_id,
    },
  });
  const userPostFix = userPosts.map((userpost) =>
    userpost.get({ plain: true })
  );
  console.log(userPostFix);
  res.render("insert", { layout: "dashboard", user, userPostFix });
});

router.get("/dashboard/new", async (req, res) => {
  res.render("newPost", { layout: "dashboard" });
});

router.get("/login", async (req, res) => {
  res.render("login", {
    layout: "dashboard",
    loginFailed: req.query?.login === "failed",
  });
});

router.get("/signup", async (req, res) => {
  res.render("signup", { layout: "dashboard" });
});

router.get("/logout", async (req, res) => {
  res.render("logout");
});

/* router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const projects = projectData.map((project) => project.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      projects, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
}); */

module.exports = router;
