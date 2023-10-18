//import routes
const routes = require('express').Router();

const createnewrequest = require('./createnewrequest');
const postolrfile = require('./postolrfile');

routes.post('/createnewrequest', createnewrequest);
routes.post('/postolrfile/:fabyyid/:sizetempid', postolrfile);

module.exports = routes;