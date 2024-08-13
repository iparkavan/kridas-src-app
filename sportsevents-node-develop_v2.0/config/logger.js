const winston = require('winston');
// const config = require('./config');

const enumerateErrorFormat = winston.format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		enumerateErrorFormat(),
	    winston.format.colorize(),
		winston.format.splat(),
		winston.format.printf(({ level, message }) => `${level}: ${message}`),
	),
	// transports: [
	//   new winston.transports.Console({
	//     stderrLevels: ['error'],
	//   }),
	// ],

	transports: [
		new winston.transports.File({
			filename: 'logs/app_log.log',
		}),
	],
});

module.exports = logger;