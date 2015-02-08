var page = require('page');

var SignupPage = require('./signup');
var OverviewPage = require('./overview');

page('/signup', function() {
  var view = SignupPage();
  view.render(document.body);

  /*
  view.once('session', function(session) {
    view.destroy();
    page('/overview');
  });
  */
});

page('/overview', function() {
  var view = OverviewPage();
  view.render(document.body);
});

page();
