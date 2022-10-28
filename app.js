require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const { corsHandler } = require('./middlewares/cors');

const NotFoundError = require('./utils/errors/not-found-err');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

// подключаем базу данных
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

// подключаем логгер запросов
app.use(requestLogger);

// мидлвер CORS запросов
app.use(corsHandler);

// роуты, доступные без авторизации
app.use('/', require('./routes/index'));

// мидлвэр авторизации
app.use(auth);

// роуты, защищенные авторизацией
app.use('/users', require('./routes/users'))

app.use(errorLogger);

// обработка несуществующего маршрута
app.use('*', () => {
  throw new NotFoundError('несуществующий маршрут');
});

// мидлвэр обработки ошибок Celebrate
app.use(errors());

// централизованная обработка ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`приложение запущено на порте ${PORT}`);
});
