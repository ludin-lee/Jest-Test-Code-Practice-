const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    static associate(models) {
      this.belongsTo(models.Posts);
      this.belongsTo(models.Users);
    }
  }
  Comments.init(
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
    },
  );
  return Comments;
};
