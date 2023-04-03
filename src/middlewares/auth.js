const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/apiError');
const { JWT_SECRET } = process.env;

/**
 * A middleware validating that authorization header and save user id in res.locals if the header is valid.
 * @param {import('express').Request} req - Request of Express.js
 * @param {import('express').Response} res - Response of Express.js
 * @param {import('express').NextFunction} next - Next function of Express.js
 */
const isLoggedIn = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const [type, credentials] = authorization.split(' ');
    if (type !== 'Bearer') throw new ApiError('잘못된 요청입니다', 400);

    try {
      res.locals.userId = jwt.verify(credentials, JWT_SECRET).userId;
      next();
    } catch {
      next(new ApiError('로그인이 필요한 기능입니다.', 401));
    }
  } catch (err) {
    next(err);
  }
};

/**
 * A middleware validating that authorization header is invalid.
 * @param {import('express').Request} req - Request of Express.js
 * @param {import('express').Response} res - Response of Express.js
 * @param {import('express').NextFunction} next - Next function of Express.js
 */
const isNotLoggedIn = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return next();

    const [type, credentials] = authorization.split(' ');
    if (type !== 'Bearer') throw new ApiError('잘못된 요청입니다', 400);

    try {
      jwt.verify(credentials, JWT_SECRET);
      next(new ApiError('이미 로그인이 되어있습니다.', 400));
    } catch {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { isLoggedIn, isNotLoggedIn };
