//import routes
const routes = require('express').Router();

const managecandidates = require('./managecandidates');
const getcandidates = require('./getcandidates');
const getcandidatesnames = require('./getcandidatesnames');
const managecandidatetags = require('./managecandidatetags');

routes.post('/managecandidates', managecandidates);
routes.get('/getcandidates/:candidate_id', getcandidates);
routes.get('/getcandidatesnames/:candidate_name', getcandidatesnames);
routes.post('/managecandidatetags', managecandidatetags);

module.exports = routes;