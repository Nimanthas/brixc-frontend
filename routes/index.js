
const express = require('express');
const routes = express.Router();

const settings = require('./settings');

routes.use('/settings', settings);

routes.use(express.json());

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'brixc api connected!' });
});

module.exports = routes;