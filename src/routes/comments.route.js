const express = require('express');
const router = express.Router();

const CommentsController = require('../controllers/comments.controller');
const commentsController = new CommentsController();
const authMiddleware = require('../middlewares/auth');

router.put(
  '/comments/:commentId',
  authMiddleware.isLoggedIn,
  commentsController.updateComment,
);
router.delete(
  '/comments/:commentId',
  authMiddleware.isLoggedIn,
  commentsController.deleteComment,
);

module.exports = router;
