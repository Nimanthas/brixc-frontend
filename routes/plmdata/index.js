const routes = require('express').Router();

const plmsession = require('./plmsession');
const plmseasonslist = require('./getseasonlist');
const getapperalboms = require('./getapperalboms');
const getrevisebomdata = require('./getrevisebomdata');
const getbomitems = require('./getbomitems');
const getbomitemspvh = require('./getbomitemspvh');
const getreviseplmbomdata = require('./getreviseplmbomdata');

routes.get('/plmsession', plmsession);
routes.post('/plmseasonslist', plmseasonslist);
routes.post('/plmapperalboms', getapperalboms);
routes.post('/plmbomdata', getrevisebomdata);
routes.post('/plmrevisedbomdata', getreviseplmbomdata);
routes.post('/getbomitems', getbomitems);
routes.post('/getbomitemspvh', getbomitemspvh);

module.exports = routes;