const express = require('express');
const log4js = require('log4js');
const initLogSettings = require('./initLogSettings');

const PORT = process.env.PORT || 3003;

initLogSettings();

const log = log4js.getLogger('server');
const app = express();

app.use((req, res, next) => {
  log.info(`${req.protocol} ${req.ip} ${req.path}`);
  next();
});

app.get('/error', (req, res, next) => {
  log.error('omg');
  res.sendStatus(400);
  next();
});

app.get('/fatal', (req, res, next) => {
  log.fatal('FATAL: 500');
  res.sendStatus(500);
  next();
});

app.get('/', (req, res, next) => {
  res.sendStatus(200);
  next();
});

app.listen(PORT, () => {
  log.info(`The server is running at http://localhost:${PORT}/`);
});
