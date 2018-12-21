const log4js = require('log4js');

function initLogSettings() {
  log4js.addLayout('json', () => logEvent => JSON.stringify(logEvent));

  log4js.configure({
    appenders: {
      stdout: {
        type: 'stdout',
      },
      file: {
        type: 'file',
        filename: 'error.log',
      },
      sentry: {
        type: 'log4js-node-sentry-appender',
        dns: process.env.SENTRY_DSN,
        env: 'production',
      },
      errorFilter: { type: 'logLevelFilter', level: 'error', appender: 'file' },
      sentryFilter: { type: 'logLevelFilter', level: 'error', appender: 'sentry' },
    },
    categories: {
      default: {
        appenders: ['stdout', 'errorFilter', 'sentryFilter'],
        level: 'debug',
      },
    },
  });
}

module.exports = initLogSettings;
