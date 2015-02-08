var express = require('express');
var taters = require('taters');
var hbs = require('hbs');
var makeover = require('makeover');
var stylish = require('stylish');
var enchilada = require('enchilada');
var serve_favicon = require('serve-favicon');
var serve_static = require('serve-static');
var debug = require('debug')('cloud');

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

taters(app, {
  cache: PRODUCTION
});

app.use(serve_favicon(__dirname + '/public/favicon.ico'));

app.use('/api', api);

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
  compress: PRODUCTION,
  cache: PRODUCTION
}));

app.use(serve_static(__dirname + '/static'));

app.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = app;
