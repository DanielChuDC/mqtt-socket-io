var express = require('express');
var bodyParser = require('body-parser');
const port = process.env.PORT || 3002;
var app = express();
var mqttHandler = require('./mqtt_handler');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mqttClient = new mqttHandler();
mqttClient.connect('world');

const path = require('path');
const router = express.Router();

// For socket-io client  and socket -io
var io = require('socket.io')(80);
var chat = io.of('/chat').on('connection', function(socket) {
  socket.emit('a message', {
    that: 'only',
    '/chat': 'will get'
  });
  chat.emit('a message', {
    everyone: 'in',
    '/chat': 'will get'
  });
});

var news = io.of('/news').on('connection', function(socket) {
  socket.emit('item', { news: 'item' });
});

// Routes
router.get('/', function(req, res) {
  mqttClient.connect('world');
  mqttClient.sendMessage('world', 'here am I');

  //res.status(200).send('Message sent to mqtt');
  res.sendFile(path.join(__dirname + '/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.post('/send-mqtt', function(req, res) {
  mqttClient.sendMessage(req.body.message);
  res.status(200).send('Message sent to mqtt');
});

app.get('/env', function(req, res) {
  mqttClient.sendMessage(req.body.message);
  res.status(200).send(process.env.mqtt_host);
  console.log(process.env.mqtt_host);
});

// //add the router
// app.use(express.static(__dirname + '/View'));
// //Store all HTML files in view folder.
// app.use(express.static(__dirname + '/Script'));
// //Store all JS and CSS in Scripts folder.

app.use('/', router);

var server = app.listen(3000, function() {
  console.log('app running on port.', server.address().port);
});
