const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = '???';
const GITHUB_CLIENT_SECRET = '???';

function findOrCreateUser(githubId, callback) {
  const user = {
    id: '1111',
    githubId: githubId,
    username: 'user from github',
    displayName: 'UserFromGithub'
  };
  callback(null, user);
}

passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function (accessToken, refreshToken, profile, done) {
      console.log('profile', profile);
      findOrCreateUser(profile.id, function (err, user) {
        return done(err, user);
      });
    }
));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

module.exports = function (app) {

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/github', passport.authenticate('github'));

  app.get('/auth/github/callback',
      passport.authenticate('github', {failureRedirect: '/login'}),
      function (req, res) {
        res.redirect('/');
      });
};
