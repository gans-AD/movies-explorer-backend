const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser, signOut } = require('../controllers/users');
const auth = require('../middlewares/auth');

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

// мидлвэр авторизации
router.use(auth);

// роуты, защищенные авторизацией
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

module.exports = router;
