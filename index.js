import express from 'express';
import mongoose from 'mongoose';

import routes from './src/routes/routes';
import './passport';

// initializing express application and setting up the local port
const app = express();
const PORT = 3000;

// Connecting to the database
mongoose
  .connect('mongodb://localhost:27017/TOAdb')
  .then(() => console.log('mongoDB connected.'))
  .catch((err) => console.log('mongoDB connection error: ', err));

// This middleware parses incoming requests with URL-encoded payloads (form data)
app.use(express.urlencoded({ extended: true }));
// This middleware parses incoming requests with JSON payloads
app.use(express.json());

// Running the routes inside the app
routes(app);

// First Endpoint
app.use('/', (req, res) => {
  res.send('Welcome to AnxietyJournal!');
});

// To know the server is running
app.listen(PORT, () => {
  console.log(`Your sever is running on port ${PORT}`);
});
