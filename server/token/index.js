const { expressjwt } = require('express-jwt');
const { SECRET_KEY } = require('./constant');

const jwtauth = expressjwt({ secret: SECRET_KEY, algorithms: ['HS256'] }).unless({ path: ['/api/auth/register', '/api/auth/login'] });

module.exports = jwtauth;
