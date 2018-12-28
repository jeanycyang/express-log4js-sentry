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
        type: 'error-sentry-appender',
        useCategoryAsFingerprint: true,
        useSecondArgumentAsExtra: true,
        sentryConfig: {
          dsn: process.env.SENTRY_DSN,
          environment: process.env.NODE_ENV || 'development',
        },
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
