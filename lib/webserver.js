var http = require('http'),
    express = require('express'),
    path = require('path'),
    config = require('../config');

var app = exports.app = express();
var server = exports.server = http.createServer(app);

app.configure(function() {
  var basePath = path.join(__dirname, '..');
  app.locals.basedir = basePath;
  app.use(express.static(path.join(basePath,'/public')));
  app.use('/img', express.static(basePath + '/public/img'));
  app.use('/css', express.static(basePath + '/public/css'));
  app.use('/cards', express.static(basePath + '/public/img/cards'));
  app.use('/js', express.static(path.join(basePath,'/public/js')));
  app.set('views', basePath + '/views');
});

// configure app based on given environment config
function configureApp(app, envConfig) {
  app.set('port', envConfig.port);
  app.set('client_port', envConfig.client_port);
}

app.configure('development', function() {
  envConfig = config.dev;
  configureApp(app, envConfig);
});

app.configure('production', function() {
  envConfig = config.prod;
  configureApp(app, envConfig);
});

var port = app.get('port'); // get port for current environment
server.listen(port);


app.get('/', function(req, res) {
  // res.render('index.jade', {port: app.get('client_port'), env: process.env.NODE_ENV || null});
  res.sendfile('index.html');
});