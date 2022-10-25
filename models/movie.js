const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator(v) {
              return validator.isURL(v);
            },
            message: 'необходимо указать ссылку',
          },
    },
    trailerLink: {
        type: String,
        required: true,
        validate: {
            validator(v) {
              return validator.isURL(v);
            },
            message: 'необходимо указать ссылку',
          },
    },
    thumbnail: {
        type: String,
        required: true,
        validate: {
            validator(v) {
              return validator.isURL(v);
            },
            message: 'необходимо указать ссылку',
          },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    movieId: {
        type: String,
        required: true,
    },
    nameRU: {
        type: String,
        required: true,
    },
    nameEN: {
        type: String,
        required: true,
    },
})