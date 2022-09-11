const { expressjwt } = require('express-jwt');
const { SECRET_KEY } = require('./constant');

const jwtauth = expressjwt({
  secret: SECRET_KEY,
  algorithms: ['HS256'],
  getToken: function (req) {
    const token = req.cookies.token;
    return token || null;
  }
}).unless({
  path:
    [
      '/api/auth/register',
      // '/api/auth/login'
    ]
});

module.exports = jwtauth;
