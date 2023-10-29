
const express = require('express');
const routes = express.Router();

const authenticateToken = require('./auth/authmiddleware');

const settings = require('./settings');
const managemeetings = require('./managemeetings');
const integrations = require('./integrations');
const auth = require('./auth');
const managejobs = require('./managejobs');
const managecandidates = require('./managecandidates');
const analyzecandidates = require('./analyzecandidates');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'brixc api connected!' });
});

routes.use('/auth', auth);
routes.use('/settings', settings);
routes.use('/managemeetings', managemeetings);
routes.use('/managejobs', managejobs);
routes.use('/managecandidates', managecandidates);
routes.use('/analyzecandidates', analyzecandidates);

//Apply middleware authentication to all routes after this
routes.use(authenticateToken);

routes.use('/integrations', integrations);

routes.use(express.json());

module.exports = routes;