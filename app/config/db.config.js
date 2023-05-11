module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "yn5$wSW4s#L0",
    PORT: "3306",
    DB: "chat_pmi",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };