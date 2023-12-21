// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const compileController = require('./controllers/compileControllers');
const mongoController = require('./controllers/mongoControllers');
const socketController = require('./controllers/socketController'); 
const scraperController = require('./controllers/scraperController'); 

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Compile-time routes
app.post('/api/compile', compileController.compileCode);
app.get('/api/getData', compileController.getData);

// MongoDB data retrieval routes
app.get('/api/getSession', mongoController.getSession);
app.post('/api/setsession', mongoController.setSession);

//Scrapper routes
app.post('/api/scrape', scraperController);

// Use the socket controller
socketController(io);

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
