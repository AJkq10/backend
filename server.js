// server.js
const express = require('express');
const cors = require('cors');
const compileController = require('./controllers/compileControllers'); // Fix the import path
const mongoController = require('./controllers/mongoControllers'); // Fix the import path

const app = express();
const port = 3000;

// Enable CORS middleware
app.use(cors());
app.use(express.json()); // This middleware parses JSON data in the request body

// Middleware and other configurations...

// Compile-time routes
app.post('/api/compile', compileController.compileCode);

// MongoDB data retrieval routes
app.get('/api/getData', mongoController.getData);
app.get('/api/getSession', mongoController.getSession);
app.post('/api/setsession', mongoController.setSession);

// Other runtime routes...

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
