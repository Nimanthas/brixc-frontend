const routes = require('express').Router();

const getcustomers = require('./getcustomers');
const getfactories = require('./getfactories');

routes.get('/getcustomers', getcustomers);
routes.get('/getfactories', getfactories);

module.exports = routes;