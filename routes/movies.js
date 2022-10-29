const router = require('express').Router();

const { getSavedMovies, createMovie } = require('../controllers/movies');

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/', getSavedMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
router.post('/', createMovie);

// удаляет сохранённый фильм по id
// router.delete('/:_id', ...);

module.exports = router;
