const router = require('express').Router();

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/', ...);

// создаёт фильм с переданными в теле 
// country, director, duration, year, description, 
// image, trailer, nameRU, nameEN и thumbnail, movieId
router.post('/', ...);

// удаляет сохранённый фильм по id
router.delete('/:_id', ...);

module.exports = router;