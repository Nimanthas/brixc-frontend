//import routes
const routes = require('express').Router();

const getcandidatestags = require('./getcandidatestags');

routes.get('/v1/getcandidatestags/:candidate_external_id', getcandidatestags);

module.exports = routes;