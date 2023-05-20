const router = require("express").Router();
const { BlogPost, Comment, User } = require("../../models");
const withAuth = require("../../utils/auth");

// /projects
// create new blogpost
// api/blogpost/new
router.post("/new", async (req, res) => {
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

// api/blogpost/search/:id
// blogpost single blog
router.get("/search/:id", withAuth, async (req, res) => {
  try {
    const blogpostData = await BlogPost.findByPk(req.params.id);
    const BlogPostId = await blogpostData.get({ plain: true });

    const commentData = await Comment.findAll({
      where: {
        blog_post_id: req.params.id,
      },
      include: {
        model: User,
        attributes: ["name"],
      },
    });
    const comments = commentData.map((commentData) =>
      commentData.get({ plain: true })
    );
    console.log(BlogPostId);
    res.render("insert", {
      logged_in: req.session.logged_in,
      BlogPostId,
      comments,
    });
  } catch (err) {
    res.json(err);
  }
});

// api/blogpost/update/:id
router.get("/update/:id", async (req, res) => {
  try {
    const blogpostData = await BlogPost.findByPk(req.params.id);
    console.log({ blogpostData });
    const BlogPosts = blogpostData.get({ plain: true });
    console.log({ BlogPosts });

    res.render("updatePost", BlogPosts);
  } catch (err) {
    console.log(err);
  }
});

// update dashboard post
// api/blogpost/update/:id
router.post("/update/:id", async (req, res) => {
  try {
    BlogPost.update(
      { ...req.body },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    console.log("Update Success");
    res.redirect(`/dashboard`);
  } catch (err) {
    console.log(err);
  }
});

// api/blogpost/update/:id
router.post("/delete/:id", async (req, res) => {
  try {
    BlogPost.delete({
      where: {
        id: req.params.id,
      },
    });
    console.log("Delete Success");
    res.redirect(`/dashboard`);
  } catch (err) {
    console.log(err);
  }
});

// api/blogpost/comment/new/:id
// comment form page
router.get("/comment/:id", async (req, res) => {
  console.log("this route is working");
  try {
    const blogpostId = await req.params.id;
    res.render("newComment", { logged_in: req.session.logged_in, blogpostId });
  } catch (err) {
    console.log(err);
  }
});

// api/blogpost/comment/new/:id
// makes new comment
router.post("/comment/:id", async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      blogPost_id: req.params.id,
      user_id: req.session.user_id,
    });
    console.log(newComment);
    res.redirect(`/api/blogpost/search/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
});

/* ======================================================== */

router.post("/", withAuth, async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newProject);
  } catch (err) {
    res.status(400).json(err);
  }
});

// /project/:id
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const projectData = await Project.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!projectData) {
      res.status(404).json({ message: "No project found with this id!" });
      return;
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
