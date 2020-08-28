'use strict'

const http = require('http');
const express = require('express');
const path = require('path');

const app = exports.app = express();
const server = exports.server = http.createServer(app);

app.set('port', process.env.PORT || 3000)

const basePath = path.join(__dirname, '..');
app.use(express.static(path.join(basePath, '/public')));
app.use('/img', express.static(basePath + '/public/img'));
app.use('/css', express.static(basePath + '/public/css'));
app.use('/cards', express.static(basePath + '/public/img/cards'));
app.use('/js', express.static(path.join(basePath, '/public/js')));
app.set('views', basePath + '/views');

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
});

app.get('/', function (_, res) {
  res.sendfile('index.html');
});
