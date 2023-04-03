const { Router } = require('express');
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth');

const router = Router();

const authController = new AuthController();

router.post('/register', authMiddleware.isNotLoggedIn, authController.register);
router.post('/login', authMiddleware.isNotLoggedIn, authController.login);

module.exports = router;
