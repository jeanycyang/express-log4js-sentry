const express = require('express');
const log4js = require('log4js');
const Sentry = require('@sentry/node');
const initLogSettings = require('./initLogSettings');

const PORT = process.env.PORT || 3003;

initLogSettings();
Sentry.init({ dsn: process.env.SENTRY_DSN });

const log = log4js.getLogger('server');
const app = express();

app.use(Sentry.Handlers.requestHandler());

app.use((req, res, next) => {
  log.info(`${req.protocol} ${req.ip} ${req.path}`);
  next();
});

app.get('/user-error', (req, res, next) => {
  try {
    const malformedJSON = '{"data":"oops",}';
    const json = JSON.parse(malformedJSON);
    res.json(json);
  } catch (err) {
    const error = new Error(err.message);
    error.status = 400;
    next(error);
  }
});

app.get('/server-error', (req, res, next) => {
  const error = new Error('some server errors');
  error.status = 500;
  next(error);
});

app.get('/uncaught', () => {
  throw new Error('Uncaught error');
});

app.get('/', (req, res) => {
  log.info('some information');
  res.sendStatus(200);
});

app.use((req, res, next) => {
  const error = new Error(`${req.path} not found`);
  error.status = 404;
  next(error);
});

app.use(Sentry.Handlers.errorHandler());

// customized error handler
app.use((err, req, res, next) => { // eslint-disable-line
  const status = (typeof err.status === 'number' && Number.isInteger(err.status) && err.status >= 100) ? err.status : 500;
  if (status >= 500) {
    log.error(err);
  }
  res.status(status).json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  log.info(`The server is running at http://localhost:${PORT}/`);
});
