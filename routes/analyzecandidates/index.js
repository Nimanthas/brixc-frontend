//import routes
const routes = require('express').Router();

const analyzevideoandaudio = require('./analyzevideoandaudio');

routes.post('/analyzevideoandaudio/:candidate_id', analyzevideoandaudio);

module.exports = routes;