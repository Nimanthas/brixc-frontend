const routes = require('express').Router();

const checkuser = require('./checkad');

routes.post('/checkuser', checkuser);

module.exports = routes;