const router = require('express').Router();
const { getCurrentUser, editUser } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getCurrentUser);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', editUser);

module.exports = router;
