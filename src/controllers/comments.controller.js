const CommentService = require('../services/comments.service');
const PostsService = require('../services/posts.service.js');
const { ApiError } = require('../utils/apiError');

class CommentsController {
  commentService = new CommentService();
  postsService = new PostsService();
  getComments = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const comments = await this.commentService.findAllComments(postId);
      console.log(postId);
      // 게시글 존재여부 확인
      const post = await this.postsService.findPostById(postId);
      if (!post) {
        throw new ApiError('없는 글입니다.', 404);
      }
      res.status(200).json({ comments: comments });
    } catch (err) {
      next(err);
    }
  };

  createComment = async (req, res, next) => {
    try {
      const { content } = req.body;
      const { postId } = req.params;
      const UserId = res.locals.userId;
      await this.postsService.findPostById(postId);

      if (!content) {
        throw new ApiError('댓글 내용을 입력해주세요.', 400);
      }

      await this.commentService.createComment(UserId, postId, content);
      res.status(201).send({ message: '댓글 등록완료.' });
    } catch (err) {
      next(err);
    }
  };

  updateComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const UserId = res.locals.userId;
      const { content } = req.body;
      // const post =
      await this.postsService.findPostById(postId);
      // if (!post) {
      //   throw new ApiError('게시글이 존재하지 않습니다.', 400);
      // }
      if (!content) {
        throw new ApiError('댓글 내용을 입력해주세요.', 400);
      }
      const comment = await this.commentService.findOneComment(commentId);
      if (!comment) {
        throw new ApiError('댓글이 존재하지 않습니다.', 400);
      }
      if (UserId !== comment.id) {
        throw new ApiError('본인의 댓글이 아닙니다.', 400);
      }
      //content.lnegth < 2 일떄
      await this.commentService.updateComment(commentId, content);
      res.status(201).send({ message: '댓글 수정에 성공하였습니다.' });
      //
    } catch (err) {
      next(err);
    }
  };

  deleteComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const comment = await this.commentService.findOneComment(commentId);
      const UserId = res.locals.userId;
      await this.postsService.findPostById(postId);
      if (!comment) {
        throw new ApiError('댓글이 존재하지 않습니다.', 400);
      }
      if (UserId !== comment.id) {
        throw new ApiError('본인의 댓글이 아닙니다.', 400);
      }

      await this.commentService.deleteComment(commentId);
      res.status(201).send({ message: '댓글 삭제에 성공하였습니다.' });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = CommentsController;
