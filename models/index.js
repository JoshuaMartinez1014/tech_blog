const User = require("./User");
const BlogPost = require("./BlogPost");
const Comment = require("./Comments");

User.hasMany(BlogPost, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

BlogPost.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
});
BlogPost.hasMany(Comment, {
  foreignKey: "blogPost_id",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
});
Comment.belongsTo(BlogPost, {
  foreignKey: "blogPost_id",
});

module.exports = { User, BlogPost, Comment };
