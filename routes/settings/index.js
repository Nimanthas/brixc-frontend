//import routes
const routes = require('express').Router();

//route paths
const manageeventtypes = require('./event_types/manageeventtypes');
const geteventtypes = require('./event_types/geteventtypes');

const managejobtypes = require('./job_types/managejobtypes');
const getjobtypes = require('./job_types/getjobtypes');

const managecandidatetypes = require('./candidate_types/managecandidatetypes');
const getcandidatetypes = require('./candidate_types/getcandidatetypes');

const managelocations = require('./locations/managelocations');
const getlocations = require('./locations/getlocations');

const managemasterdepartments = require('./departments/managemasterdepartments');
const getmasterdepartments = require('./departments/getmasterdepartments');

const managetags = require('./tags/managetags');
const gettags = require('./tags/gettags');

const managetokens = require('./tokenmanager/managetokens');
const gettokens = require('./tokenmanager/getzoomtoken');


//routes
routes.post('/manageeventtypes', manageeventtypes);
routes.get('/geteventtypes/:event_type_id', geteventtypes);

routes.post('/managecandidatetypes', managecandidatetypes);
routes.get('/getcandidatetypes/:candidate_type_id', getcandidatetypes);

routes.post('/managejobtypes', managejobtypes);
routes.get('/getjobtypes/:job_type_id', getjobtypes);

routes.post('/managelocations', managelocations);
routes.get('/getlocations/:location_id', getlocations);

routes.post('/managemasterdepartments', managemasterdepartments);
routes.get('/getmasterdepartments/:department_id', getmasterdepartments);

routes.post('/managetags', managetags);
routes.get('/gettags/:tag_id', gettags);

routes.post('/managetokens', managetokens);
routes.get('/gettokens/:token_id', gettokens);

module.exports = routes;