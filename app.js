const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { errorLogger, requestLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookiParser());

// подключаем базу данных
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

// подключаем логгер запросов
app.use(requestLogger);

app.use(errorLogger)

app.listen(PORT, () => {
  console.log(`приложение запущено на порте ${PORT}`);
});
