const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('./constant')

module.exports.genToken = (payload, options) => {
  return jwt.sign(payload, SECRET_KEY, options);
}