const log4js = require('log4js');

function initLogSettings() {
  log4js.addLayout('json', () => logEvent => JSON.stringify(logEvent));

  log4js.configure({
    appenders: {
      out: {
        type: 'stdout',
      },
    },
    categories: {
      default: {
        appenders: ['out'],
        level: 'debug',
      },
    },
  });
}

module.exports = initLogSettings;
