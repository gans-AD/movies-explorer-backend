const jwt = require('jsonwebtoken');
const AuthentificationError = require('../utils/errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // извлекаем токен
  const token = req.cookies.jwt;

  // убеждаемся, что он есть
  if (!token) {
    throw new AuthentificationError('Необходима авторизация');
  }

  let payload;
  // верифицируем токен
  // проверяем что пользователь прислал именно тот токен, который был выдан ему ранее
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch {
    next(new AuthentificationError('Необходима авторизация'));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next();
};
