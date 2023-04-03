const { createLogger, transports, format } = require('winston');
const { NODE_ENV } = process.env;

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'info.log',
    }),
    new transports.File({
      dirname: 'logs',
      filename: 'error.log',
      level: 'error',
    }),
  ],
});

if (NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          ({ timestamp, level, message }) =>
            `${timestamp} [${level}] ${
              message instanceof Object ? JSON.stringify(message) : message
            }`,
        ),
      ),
      level: 'silly',
    }),
  );
}

logger.stream = { write: (message) => logger.http(message) };

module.exports = logger;
