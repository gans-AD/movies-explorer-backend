const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, editUser } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getCurrentUser);

// обновляет информацию о пользователе (email и имя)
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    }),
  }),
  editUser,
);

module.exports = router;
