const mqtt = require('mqtt');
require('dotenv').config();

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    // this.host = 'mqtt://<host>:8883';  //connect to 1883
    this.host = process.env.mqtt_host + ':' + process.env.mqtt_port;
    this.username = process.env.mqtt_username; // mqtt credentials if these are needed to connect
    this.password = process.env.mqtt_password;
    console.log(process.env.mqtt_host);
  }

  connect(topic) {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });

    //this.mqttClient = mqtt.connect(this.host);
    // Mqtt error calback
    this.mqttClient.on('error', err => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
      console.log(process.env.mqtt_host);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe(topic, { qos: 2 });

    // When a message arrives, console.log it
    this.mqttClient.on('message', function(topic, message) {
      console.log(message.toString());
    });

    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  // Make Options , Quality of service level = 2
  sendMessage(topic, message) {
    this.mqttClient.publish(topic, message, {
      qos: 2,
      retain: false,
      dup: false
    });
  }
}

module.exports = MqttHandler;
