const CommentRepository = require('../repositories/comments.repository');
const { Comments, Users } = require('../models');

class CommentService {
  commentRepository = new CommentRepository(Comments, Users);

  findAllComments = async (postId) => {
    const allComments = await this.commentRepository.findAllComments(postId);

    allComments.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allComments.map((comment) => {
      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        User: comment.User,
      };
    });
  };

  createComment = async (userId, postId, content) => {
    return await this.commentRepository.createComment(userId, postId, content);
  };

  updateComment = async (commentId, content) => {
    return await this.commentRepository.updateComment(commentId, content);
  };
  deleteComment = async (commentId) => {
    return await this.commentRepository.deleteComment(commentId);
  };
  findOneComment = async (commentId) => {
    return await this.commentRepository.findOneComment(commentId);
  };
}

module.exports = CommentService;
