//import routes
const routes = require('express').Router();

const createnewmeeting = require('./createnewmeeting');

routes.post('/createnewmeeting', createnewmeeting);

module.exports = routes;