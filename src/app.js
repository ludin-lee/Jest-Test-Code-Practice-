const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { urlencoded } = require('express');
const morgan = require('morgan');
const api = require('./routes');
const logger = require('./config/logger');
const db = require('./models');
const {
  errorConverter,
  errorLogger,
  errorHandler,
} = require('./middlewares/error');

const { PORT } = process.env;

const app = express();

db.sequelize
  .sync({ force: false, alter: true })
  .then(() => {
    logger.info('MySQL connect success');
  })
  .catch((err) => {
    logger.error(err.message);
  });

app.use(morgan('dev', { stream: logger.stream }));
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use('/', api);

app.use(errorConverter);
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`${PORT} 포트로 서버가 열렸습니다.`);
});

module.exports = app;
