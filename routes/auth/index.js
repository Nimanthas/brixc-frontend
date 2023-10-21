const routes = require('express').Router();

const getrefreshsessionaccess = require('./getrefreshsessionaccess');

routes.post('/v1/getrefreshsessionaccess', getrefreshsessionaccess);

module.exports = routes;