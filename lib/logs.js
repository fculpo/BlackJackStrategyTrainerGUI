var winston = require('winston');
var path = require('path');

var pathFile = path.join(__dirname, '../logs/bjt.logs');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {colorize: true});
winston.add(winston.transports.File, { filename: pathFile, colorize: true });

module.exports = winston;