const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator(v) {
              return validator.isEmail(v);
            },
            message: 'некорректно указан Email',
          },
    },
    password: {
        type: String,
        required: true,
        select: false,
    }
})

// проверяем наличие пользователя с указанными почтой и паролем
userSchema.statics.findUserByCredentials = function (email, password) {
    return this.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          throw new AuthentificationError('Неправильные почта или пароль');
        }
        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            throw new AuthentificationError('Неправильные почта или пароль');
          }
          return user;
        });
      });
  };
  
  // создаём модель и экспортируем её
  module.exports = mongoose.model('user', userSchema);