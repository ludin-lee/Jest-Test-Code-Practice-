const { DB_USER, DB_PASSWORD, DB_DATABASE, DB_HOST, DB_DATABASE_TEST } =
  process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: 'mysql',
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE_TEST,
    host: DB_HOST,
    dialect: 'mysql',
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: 'mysql',
  },
};
