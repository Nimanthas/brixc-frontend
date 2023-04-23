
const express = require('express');
const routes = express.Router();
const XLSX = require('xlsx');

const login = require('./login');
const fabricyy = require('./fabricyy');
const plmaccess = require('./plmdata');
const masterdata = require('./masterdata');
const editrequest = require('./editrequest');
const plmdata = require('./editrequestplmdata');
const dashboard = require('./dashboard');

routes.use('/login', login);
routes.use('/fabricyy', fabricyy);
routes.use('/plmaccess', plmaccess);
routes.use('/plmdata', plmdata);
routes.use('/masterdata', masterdata);
routes.use('/editrequest', editrequest);
routes.use('/dashboard', dashboard);

routes.use(express.json());

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'fabric yy api connected!' });
});

module.exports = routes;