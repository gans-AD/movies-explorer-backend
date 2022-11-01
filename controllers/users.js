const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const BadRequestError = require('../utils/errors/bad-req-err');
const NotFoundError = require('../utils/errors/not-found-err');
const DuplicateError = require('../utils/errors/duplicate-err');

// создание пользователя
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body; // получаем из запроса объект с данными

  // создаем хеш пароля
  // и записываем пользователя в базу, вместо пароля сохраняем его хеш

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } else if (err.code === 11000) {
        next(new DuplicateError('Пользователь с таким Email уже существует'));
      } else {
        next(err);
      }
    });
};

// аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // успешная аутентификация
      // создаем токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        {
          expiresIn: '7d',
        },
      );

      // отправляем токен в куки
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: `Пользователь ${user.name} успешно авторизован` });
    })
    .catch(next);
};

// выход из приложения
module.exports.signOut = (req, res, next) => {
  // удаляем cookie из браузера
  res.clearCookie('jwt').send({ message: 'jwt удалён из cookie' }).catch(next);
};

// запрос информации о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

// редактирование профиля
module.exports.editUser = (req, res, next) => {
  const { name, email } = req.body;

  // проверка дублирования email
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new DuplicateError(
          'указанный Email используется другим пользователем',
        );
      }
    })
    .catch(next);

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      } else {
        next(err);
      }
    });
};
