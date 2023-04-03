const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

const PostsController = require('../controllers/posts.controller.js');
const postsController = new PostsController();
const CommentsController = require('../controllers/comments.controller');
const commentsController = new CommentsController();
router.post('/', authMiddleware.isLoggedIn, postsController.createPost);
router.get('/', postsController.getPosts);
router.get('/:postId', postsController.getPostById);
router.put('/:postId', authMiddleware.isLoggedIn, postsController.updatePost);
router.delete(
  '/:postId',
  authMiddleware.isLoggedIn,
  postsController.deletePost,
);
router.get(
  '/:postId/comments',
  authMiddleware.isLoggedIn,
  commentsController.getComments,
);
router.post(
  '/:postId/comments',
  authMiddleware.isLoggedIn,
  commentsController.createComment,
);
module.exports = router;
