const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();
const { handleSocketConnections } = require('./socket'); 
const routes = require('./routes'); 

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['POST', 'GET'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});


handleSocketConnections(io);


app.use(routes);

server.listen(5000, () => {
    console.log('hey its running man');
});
