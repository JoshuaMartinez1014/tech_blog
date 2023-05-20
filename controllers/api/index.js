const router = require("express").Router();
const userRoutes = require("./userRoutes");
const BlogPostRoutes = require("./blogPostRoutes");

router.use("/users", userRoutes);
router.use("/blogpost", BlogPostRoutes);

module.exports = router;
