const PostsService = require('../services/posts.service.js');
const { ApiError } = require('../utils/apiError');

class PostsController {
  postsService = new PostsService();

  createPost = async (req, res, next) => {
    try {
      const UserId = res.locals.userId;
      const { title, content, image } = req.body;

      // 게시글 제목/내용 있는지 확인
      if (!title || !content) {
        throw new ApiError('게시글 제목/내용을 입력해주세요.', 400);
      }
      await this.postsService.createPost(UserId, title, content, image);

      res.status(201).json({ message: '게시글 작성에 성공했습니다.' });
    } catch (err) {
      next(err);
    }
  };

  getPosts = async (req, res, next) => {
    try {
      const posts = await this.postsService.findAllPosts();
      res.status(200).json({ posts: posts });
    } catch (err) {
      next(err);
    }
  };

  getPostById = async (req, res, next) => {
    try {
      const { postId } = req.params;

      // 게시글 존재하는지 확인
      const post = await this.postsService.findPostById(postId);
      if (!post) {
        throw new ApiError('게시글이 존재하지 않습니다.', 400);
      }

      res.status(200).json({ post });
    } catch (err) {
      next(err);
    }
  };

  updatePost = async (req, res, next) => {
    try {
      const UserId = res.locals.userId; // authMiddleware가 변수로 저장해서 {UserId}가 아님
      const { postId } = req.params;
      const { title, content } = req.body;

      // 게시글 존재하는지 확인
      const post = await this.postsService.findPostById(postId);
      if (!post) {
        throw new ApiError('게시글이 존재하지 않습니다.', 400);
      }

      // 로그인한 계정이 게시글 작성자인지 확인
      if (post.User.id !== UserId) {
        throw new ApiError('게시글 작성자가 아닙니다.', 400);
      }

      // 게시글 제목/내용 있는지 확인
      if (!title || !content) {
        throw new ApiError('게시글 제목/내용을 입력해주세요.', 400);
      }

      await this.postsService.updatePost(postId, title, content);

      res.status(200).json({ message: '게시글 수정에 성공했습니다.' });
    } catch (err) {
      next(err);
    }
  };

  deletePost = async (req, res, next) => {
    try {
      const UserId = res.locals.userId;
      const { postId } = req.params;

      // 게시글 존재하는지 확인
      const post = await this.postsService.findPostById(postId);
      if (!post) {
        throw new ApiError('게시글이 존재하지 않습니다.', 400);
      }

      // 로그인한 계정이 게시글 작성자인지 확인
      if (post.User.id !== UserId) {
        throw new ApiError('게시글 작성자가 아닙니다.', 400);
      }

      await this.postsService.deletePost(postId);

      res.status(200).json({ message: '게시글 삭제에 성공했습니다.' });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = PostsController;
