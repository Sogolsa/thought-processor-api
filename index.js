import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from './src/routes/routes';
import './passport';

// Load environment variables from .env file
dotenv.config();

// initializing express application
const app = express();

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: true })); // parses incoming requests with URL-encoded payloads (form data)
app.use(express.json()); //parses incoming requests with JSON payloads

// Connecting to the database locally
mongoose
  .connect('mongodb://localhost:27017/TOAdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected.'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// mongoose
// .connect(process.env.CONNECTION_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected.'))
// .catch((err) => console.log('MongoDB connection error: ', err));

// Running the routes inside the app
routes(app);

// First Endpoint
app.use('/', (req, res) => {
  res.send('Welcome to AnxietyJournal!');
});

// Port setup
const PORT = 3000;

// To know the server is running
app.listen(PORT, () => {
  console.log(`Your sever is running on port ${PORT}`);
});
