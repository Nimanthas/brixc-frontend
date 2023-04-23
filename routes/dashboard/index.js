//import routes
const routes = require('express').Router();

const getfabricyyrequestdetails = require('./getfabricyyrequestdetails');

routes.post('/getfabricyyrequestdetails', getfabricyyrequestdetails);

module.exports = routes;