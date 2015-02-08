var express = require('express');
var taters = require('taters');
var hbs = require('hbs');
var makeover = require('makeover');
var browserify_file = require('browserify-file');
var stylish = require('stylish');
var enchilada = require('enchilada');
var serve_favicon = require('serve-favicon');
var serve_static = require('serve-static');
var debug = require('debug')('cloud');
var mongoose = require('mongoose');
var cookie_parser = require('cookie-parser');
var yummy = require('yummy');

mongoose.connect(process.env.MONGODB_URL);

var api = require('./routes/api');

var PRODUCTION = process.env.NODE_ENV === 'production';

var app = express();
app.disable('x-powered-by');
app.enable('trust proxy');

app.set('views', __dirname + '/views');
app.set('view engine', 'html' );
app.set('view options', {
  cache: PRODUCTION
});
app.engine('html', hbs.__express);

app.use(serve_favicon(__dirname + '/public/favicon.ico'));

// bypass taters for .map.json files
// otherwise it will 404 when it tries to lookup the response
// because the hash is incorrect (the hash is the hash of the underlying js file)
app.use(function(req, res, next) {
    if (/.map.json$/.test(req.path)) {
        req.url = req.path.replace(/\/static\/[a-f0-9]{6}/, '');
        return next();
    }
    next();
});

taters(app, {
  cache: PRODUCTION
});

app.use(stylish({
  src: __dirname + '/public',
  cache: PRODUCTION,
  compress: PRODUCTION,
  setup: function(renderer) {
    renderer
      .set('include css', true)
      .use(makeover())
    return renderer;
  }
}));

app.use(enchilada({
  src: __dirname + '/public',
  debug: !PRODUCTION,
  compress: PRODUCTION,
  cache: PRODUCTION,
  transforms: [browserify_file({ minify: { collapseWhitespace: true, removeComments: true }})],
}));

app.use(serve_static(__dirname + '/static'));

app.use(cookie_parser());
app.use(yummy({
  key: 'cloud.sess',
  secret: process.env.YUMMY_SECRET
}));

app.use('/api', api);

app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/signup', function(req, res, next) {
  res.render('index');
});

app.get('/overview', function(req, res, next) {
  res.render('index');
});

module.exports = app;
