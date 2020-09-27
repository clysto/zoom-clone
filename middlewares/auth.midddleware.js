const passport = require('passport');

function auth(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) throw err;
    if (!user) {
      // 没有合法的JWT
      res.status(401).json({
        error: 'JWT令牌不存在或不合法',
      });
    } else {
      req.login(user, { session: false }, (err) => {
        if (err) throw err;
        next();
      });
    }
  })(req, res, next);
}

module.exports = auth;
