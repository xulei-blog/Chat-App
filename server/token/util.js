const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('./constant')

module.exports.setCookieToken = (payload, tokenOptions, cookieOptions, res, name) => {
  let token = jwt.sign(payload, SECRET_KEY, tokenOptions);
  res.cookie(name, token, cookieOptions);
}