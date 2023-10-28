//import routes
const routes = require('express').Router();

const managejobposts = require('./managejobposts');
const getjobposts = require('./getjobposts');
const managejobtags = require('./managejobtags');

routes.post('/managejobposts', managejobposts);
routes.get('/getjobposts/:job_id', getjobposts);
routes.post('/managejobtags', managejobtags);

module.exports = routes;