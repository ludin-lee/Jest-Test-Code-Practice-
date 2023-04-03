const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    static associate(models) {
      this.hasMany(models.Comments);
      this.belongsTo(models.Users);
      this.belongsToMany(models.Users, {
        through: 'LikedPosts',
        as: 'likePostId',
        updatedAt: false,
      });
    }
  }
  Posts.init(
    {
      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      paranoid: true,
    },
  );
  return Posts;
};
