const Movie = require('../models/movie');

const BadRequestError = require('../utils/errors/bad-req-err');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({}).then((movies) => {
    res.send({ data: movies }).catch(next);
  });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError('Переданы некорректные данные при создании фильма'),
        );
      } else {
        next(err);
      }
    });
};
