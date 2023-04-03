const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const { Users } = require('../models');
const AuthRepository = require('../repositories/auth.repository');
const { ApiError } = require('../utils/apiError');
const PASSWORD_SALT = parseInt(process.env.PASSWORD_SALT);
const { JWT_SECRET } = process.env;

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository(Users);
  }
  /**
   * Create a new user if the email is not exist .
   * @param {String} email - Email to login
   * @param {String} nickname - Nickname to display
   * @param {String} password - Password to login
   * @param {String} confirm - Confirm password
   */
  register = async (email, nickname, password, confirm) => {
    if (password !== confirm)
      throw new ApiError('비밀번호 확인이 일치하지 않습니다.', 400);

    const existUser = await this.authRepository.getUserByEmail(email);
    if (existUser) throw new ApiError('이미 가입된 이메일입니다.', 400);

    const hashedPassword = await bcrypt.hash(password, parseInt(PASSWORD_SALT));

    await this.authRepository.createUser(email, nickname, hashedPassword);
  };
  /**
   * Find the user registered by the email, compare password and return a signed access token.
   * @param {String} email - Email to login
   * @param {String} password - Password to login
   * @returns {Promise<String>} - Signed access token
   */
  login = async (email, password) => {
    const user = await this.authRepository.getUserByEmail(email);
    if (!user) throw new ApiError('이메일 또는 비밀번호가 틀렸습니다.', 400);

    const comparisonResult = await bcrypt.compare(password, user.password);

    if (!comparisonResult)
      throw new ApiError('이메일 또는 비밀번호가 틀렸습니다.', 400);

    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: 60 * 60 });
  };
}

module.exports = AuthService;
