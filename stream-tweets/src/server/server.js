require('dotenv').config({ path: '../../.env' });

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const path = require('path');
const server = require('http').createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);

require('./StreamTweets.js')(app, io);

server.listen(3001, () => {
    console.log('server is running');
});