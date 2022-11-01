const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser, signOut } = require('../controllers/users');

// роуты, доступные без авторизации
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.get('/signout', signOut);

module.exports = router;
