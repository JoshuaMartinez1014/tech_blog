const sequelize = require("../config/connection");
const { User, BlogPost, Comment } = require("../models");
const { format_date } = require("../utils/helpers");

const userData = require("./userData.json");
const blogPostData = require("./blogPostData.json");
const commentData = require("./commentData.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const blogPosts = await BlogPost.bulkCreate(
    blogPostData.map((blogPost) => ({
      ...blogPost,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      description: format_date(new Date()),
    })),
    { returning: true }
  );

  await Comment.bulkCreate(
    commentData.map((comment) => ({
      ...comment,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      blogPost_id: blogPosts[Math.floor(Math.random() * blogPosts.length)].id,
      time: format_date(new Date()),
    }))
  );

  process.exit(0);
};

seedDatabase();
