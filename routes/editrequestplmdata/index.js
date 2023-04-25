const routes = require('express').Router();

const getapperalboms = require('./getapperalboms');
const getreviseplmbomdata = require('./getreviseplmbomdata');
const plmseasonslist = require('./getseasonlist');
const getplmbomitems = require('./getplmbomitems');
const postplmcolordata = require('./postplmcolordata');
const postplmitemdata = require('./postplmitemdata');
const postplmyydata = require('./postplmyydata');
const postplmdata = require('./postplmdata');
const plmseasonname = require('./plmseasonname');
const postprocessplmlines = require('./postprocessplmlines');

routes.post('/plmapperalboms', getapperalboms);
routes.post('/plmrevisedbomdata', getreviseplmbomdata);
routes.post('/plmseasonslist', plmseasonslist);
routes.post('/getplmbomitems', getplmbomitems);
routes.post('/postplmcolordata', postplmcolordata);
routes.post('/postplmitemdata', postplmitemdata);
routes.post('/postplmyydata', postplmyydata);
routes.post('/postplmdata', postplmdata);
routes.post('/plmseasonname', plmseasonname);
routes.post('/postprocessplmlines/:fabyyid', postprocessplmlines);


module.exports = routes;