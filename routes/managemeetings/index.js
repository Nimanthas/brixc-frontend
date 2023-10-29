//import routes
const routes = require('express').Router();

const createnewmeeting = require('./createnewmeeting');
const getmeetingrecording = require('./getmeetingrecording');

routes.post('/createnewmeeting', createnewmeeting);
routes.post('/getmeetingrecording', getmeetingrecording);

module.exports = routes;