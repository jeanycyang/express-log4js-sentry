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
      errorFilter: { type: 'logLevelFilter', level: 'error', appender: 'file' },
    },
    categories: {
      default: {
        appenders: ['stdout', 'errorFilter'],
        level: 'debug',
      },
    },
  });
}

module.exports = initLogSettings;
