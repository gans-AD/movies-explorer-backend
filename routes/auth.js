const router = require('express').Router();
const { createUser } = require('../controllers/user');
const { celebrate, Joi, errors } = require('celebrate');

// регистрация пользователя
const router.post('/signup', celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
      }),
}), createUser);
