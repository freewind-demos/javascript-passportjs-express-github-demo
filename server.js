const express = require('express');
const passportConfig = require('./passport-config');

// Create a new Express application.
const app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

passportConfig(app);

// Define routes.
app.get('/',
    function (req, res) {
      res.render('home', {user: req.user});
    });

app.get('/login',
    function (req, res) {
      res.render('login');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
      res.render('profile', {user: req.user});
    });

app.listen(3000);
