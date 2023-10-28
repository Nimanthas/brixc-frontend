//import routes
const routes = require('express').Router();

const getcandidatestags = require('./getcandidatestags');
const getcandidatetaggings = require('./getcandidatetaggings');

routes.get('/v1/getcandidatestags/:candidate_external_id', getcandidatestags);
routes.get('/v1/getcandidatetaggings/:candidate_external_id', getcandidatetaggings);

module.exports = routes;