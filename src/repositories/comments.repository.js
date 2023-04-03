class CommentRepository {
  constructor(CommentsModel, UsersModel) {
    this.usersModel = UsersModel;
    this.commentsModel = CommentsModel;
  }
  findAllComments = async (postId) => {
    const Comments = await this.commentsModel.findAll({
      attributes: ['id', 'content', 'createdAt', 'updatedAt'],
      include: [
        {
          model: this.usersModel,
          as: 'User',
          attributes: ['id', 'nickname'],
        },
      ],
      where: { postId },
    });

    return Comments;
  };

  createComment = async (userId, postId, content) => {
    return await this.commentsModel.create({
      content,
      UserId: userId,
      PostId: postId,
    });
  };

  updateComment = async (commentId, content) => {
    return await this.commentsModel.update(
      { content },
      { where: { id: commentId } },
    );
  };

  deleteComment = async (commentId) => {
    return await this.commentsModel.destroy({ where: { id: commentId } });
  };

  findOneComment = async (commentId) => {
    return await this.commentsModel.findOne({ where: { id: commentId } });
  };
}

module.exports = CommentRepository;
