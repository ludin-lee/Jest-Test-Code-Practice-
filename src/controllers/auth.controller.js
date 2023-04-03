const AuthService = require('../services/auth.service');
const { ApiError } = require('../utils/apiError');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }
  /**
   * A middleware to register.
   * @param {import('express').Request} req - Request of Express.js
   * @param {import('express').Response} res - Response of Express.js
   * @param {import('express').NextFunction} next - Next function of Express.js
   */
  register = async (req, res, next) => {
    try {
      const { email, nickname, password, confirm } = req.body;

      //TODO: joi로 대체할 예정
      if (!email || !nickname || !password || !confirm)
        throw new ApiError('잘못된 요청입니다.', 400);

      await this.authService.register(email, nickname, password, confirm);

      res.status(200).json({ message: '회원 가입에 성공했습니다.' });
    } catch (err) {
      next(err);
    }
  };

  /**
   * A middleware to get an access token by logging in.
   * @param {import('express').Request} req - Request of Express.js
   * @param {import('express').Response} res - Response of Express.js
   * @param {import('express').NextFunction} next - Next function of Express.js
   */
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      //TODO: joi로 대체할 예정
      if (!email || !password) throw new ApiError('잘못된 요청입니다.', 400);

      const accessToken = await this.authService.login(email, password);
      res.status(200).json({ message: '로그인에 성공했습니다.', accessToken });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = AuthController;
