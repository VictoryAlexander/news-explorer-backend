const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');
const limiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { mongoServerAddress } = require('./utils/config');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect(mongoServerAddress);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
})