//import routes
const routes = require('express').Router();

const createnewrequest = require('./createnewrequest');
const postolrfile = require('./postolrfile');
const getfabricyyrequestrefresheddata = require('./getfabricyyrequestrefresheddata');
const getplmitemsindb = require('./getplmitemsindb');
const updateolritemgraphicdetail = require('./updateolritemgraphicdetail');
const updateolritemdyeandwashdetail = require('./updateolritemdyeandwashdetail');
const postolrsizeitemdata = require('./postolrsizeitemdata');
const getolrsizewiseitem = require('./getolrsizewiseitem');
const getplmiteminbom = require('./getplmiteminbom');
const postplmbomitemdata = require('./postplmbomitemdata');

routes.post('/createnewrequest', createnewrequest);
routes.post('/postolrfile/:fabyyid/:sizetempid', postolrfile);
routes.get('/getfabricyyrequestrefresheddata/:fabyyid', getfabricyyrequestrefresheddata);
routes.get('/getplmitemsindb/:fabyyid', getplmitemsindb);
routes.post('/updateolritemgraphicdetail/:fabyyid', updateolritemgraphicdetail);
routes.post('/updateolritemdyeandwashdetail/:fabyyid', updateolritemdyeandwashdetail);
routes.post('/postolrsizeitemdata', postolrsizeitemdata);
routes.post('/getolrsizewiseitem/:item_id', getolrsizewiseitem);
routes.post('/getplmiteminbom/:item_id', getplmiteminbom);
routes.post('/postplmbomitemdata/:fabyyid', postplmbomitemdata);

module.exports = routes;