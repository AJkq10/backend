// controllers/mongoController.js
const { MongoClient } = require('mongodb');

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'project';

const client = new MongoClient(mongoUrl);

client.connect(err => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      return;
    }
    console.log('Connected to MongoDB');
  });
// MongoDB data retrieval and manipulation functionality
async function getData(req, res) {
    try {
        const db = client.db(dbName);
        const collection = db.collection('sessions');
        const result = await collection.find({}).toArray();
        console.log(result);
        res.json({ isError: 0, result });
      } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        res.status(500).json({ isError: 1, result: 'Error retrieving data from MongoDB' });
      }
}

async function getSession(req, res) {
    try {
        const db = client.db(dbName);
        const collection = db.collection('sessions');
        const newSession = generateNewSession();
        console.log('Searching for session with sessionId:', newSession);
        const existingSession = await collection.findOne({ sessionId: newSession });
        console.log(existingSession);
        if (existingSession) {
          console.log('Session already exists. Generating a new one.');
          return res.redirect('/api/getSession');
        }
        const result = await collection.insertOne({
          sessionId: newSession,
          userId: [1],
        });
        
        if (result) {
          console.log('Retrieved data from MongoDB:', result);
          res.json({ isError: 0, result });
        } else {
          console.error('No data retrieved from MongoDB');
          res.status(404).json({ isError: 1, result: 'No data retrieved from MongoDB' });
        }
      } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        res.status(500).json({ isError: 1, result: 'Error retrieving data from MongoDB' });
      }}

async function setSession(req, res) {
    try {
        const { sessionId } = req.body;
        console.log(req.body);
        const db = client.db(dbName);
        const collection = db.collection('sessions');
        const existingSession = await collection.findOne({ sessionId: sessionId });
    
        let N = 0;
    
        if (existingSession) {
          N = existingSession.userId.length;
          const updateResult = await collection.updateOne(
            { sessionId: sessionId },
            { $push: { userId: N + 1 }}
          );
    
          if (updateResult.modifiedCount === 1) {
            const updatedSession = await collection.findOne({ sessionId: sessionId });
            console.log('Updated session:', updatedSession);
            res.json({ isError: 0, result: updatedSession });
          } else {
            console.error('Failed to update session');
            res.status(500).json({ isError: 1, result: 'Failed to update session' });
          }
        } else {
          const newSession = await collection.insertOne({
            sessionId: sessionId,
            userId: [1],
          });
          console.log(newSession);
          res.json({ isError: 0, result: newSession });
        }
      } catch (error) {
        console.error('Error updating or creating session:', error);
        res.status(500).json({ isError: 1, result: 'Error updating or creating session' });
      }}

function generateNewSession() {
  const newSession = Math.floor(Math.random() * 9).toString();
  return newSession;
}

module.exports = {
  getData,
  getSession,
  setSession,
};
