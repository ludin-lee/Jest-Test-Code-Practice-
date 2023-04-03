const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.hasMany(models.Posts);
      this.hasMany(models.Comments);
      this.belongsToMany(models.Posts, {
        through: 'LikedPosts',
        as: 'likeUserId',
        updatedAt: false,
      });
    }
  }
  Users.init(
    {
      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      nickname: {
        unique: false,
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      paranoid: true,
    },
  );
  return Users;
};
