const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { errorHandler } = require('./middlewares/errorHandler');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const NotFoundError = require('./utils/errors/not-found-err');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookiParser());

// подключаем базу данных
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

// подключаем логгер запросов
app.use(requestLogger);

app.use(errorLogger);

// обработка несуществующего маршрута
app.use('*', () => {
  throw new NotFoundError('несуществующий маршрут');
});

// централизованная обработка ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`приложение запущено на порте ${PORT}`);
});
