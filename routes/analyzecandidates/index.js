//import routes
const routes = require('express').Router();

const analyzevideoandaudio = require('./analyzevideoandaudio');
const getpendinganalyzejobs = require('./getpendinganalyzejobs');

routes.post('/analyzevideoandaudio', analyzevideoandaudio);
routes.get('/getpendinganalyzejobs/:task_id', getpendinganalyzejobs);

module.exports = routes;