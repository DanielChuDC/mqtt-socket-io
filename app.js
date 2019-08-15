var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mqttHandler = require('./mqtt_handler');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mqttClient = new mqttHandler();
mqttClient.connect();

// Routes
app.post('/send-mqtt', function(req, res) {
  mqttClient.sendMessage(req.body.message);
  res.status(200).send('Message sent to mqtt');
});

app.get('/env', function(req, res) {
  mqttClient.sendMessage(req.body.message);
  res.status(200).send(process.env.mqtt_host);
  console.log(process.env.mqtt_host);
});

var server = app.listen(3000, function() {
  console.log('app running on port.', server.address().port);
});
