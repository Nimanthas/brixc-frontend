// Bring in our dependencies
const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

// Import Routes
const routes = require('./routes');
const Settings = require("./settings");

const fileUpload = require('express-fileupload');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));
app.use(cors());
app.use(fileUpload());

//Connect all our routes to our application
app.use('/', routes);


// Turn on that server!
const PORT = Settings.port || 8280;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});