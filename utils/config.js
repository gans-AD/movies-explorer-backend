const config = {
  development: {
    database: {
      uri: 'mongodb://localhost:27017/moviesdb',
    },
    jwtSecret: 'some-secret-key',
  },
};

module.exports = { config };
