//import routes
const routes = require('express').Router();

const postolrfile = require('./postolrfile');
const getfabricyyrequestrefresheddata = require('./getfabricyyrequestrefresheddata');
const getplmitemsindb = require('./getplmitemsindb');
const updateolritemgraphicdetail = require('./updateolritemgraphicdetail');
const updateolritemdyeandwashdetail = require('./updateolritemdyeandwashdetail');

routes.post('/postolrfile/:fabyyid/:sizetempid', postolrfile);
routes.get('/getfabricyyrequestrefresheddata/:fabyyid', getfabricyyrequestrefresheddata);
routes.get('/getplmitemsindb/:fabyyid', getplmitemsindb);
routes.post('./updateolritemgraphicdetail/:fabyyid', updateolritemgraphicdetail);
routes.post('./updateolritemdyeandwashdetail/:fabyyid', updateolritemdyeandwashdetail);

module.exports = routes;