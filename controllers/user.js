const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const BadRequestError = require('../utils/errors/bad-req-err');
const NotFoundError = require('../utils/errors/not-found-err');
const DuplicateError = require('../utils/errors/duplicate-err');

// создание пользователя
module.exports.createUser = (req, res, next) => {
    const {
      name, email, password,
    } = req.body; // получаем из запроса объект с данными
  
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