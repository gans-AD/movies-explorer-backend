require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { errorHandler } = require('./middlewares/errorHandler');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const { corsHandler } = require('./middlewares/cors');
const { config } = require('./utils/config');
const { limiter } = require('./utils/rate-limiter');

const NotFoundError = require('./utils/errors/not-found-err');

const { PORT = 3000, NODE_ENV, DATABASE_URI } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(limiter);

// подключаем базу данных
mongoose.connect(
  NODE_ENV === 'production' ? DATABASE_URI : config.development.database.uri,
);

// подключаем логгер запросов
app.use(requestLogger);

// мидлвер CORS запросов
app.use(corsHandler);

// подключаем роуты
app.use('/', require('./routes/index'));

// обработка несуществующего маршрута
app.use('*', () => {
  throw new NotFoundError('несуществующий маршрут');
});

app.use(errorLogger);

// мидлвэр обработки ошибок Celebrate
app.use(errors());

// централизованная обработка ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`приложение запущено на порте ${PORT}`);
});
