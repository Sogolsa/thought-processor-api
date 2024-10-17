import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

import routes from './src/routes/routes';
import './passport';

// Load environment variables from .env file
dotenv.config();

// initializing express application
const app = express();

// Importing Yaml file
const swaggerDocument = yaml.load('./swagger.yaml');

// Setting up Swagger UI middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
  res.send('Welcome to Thought Tracking Journal API!');
});

// Port setup
const PORT = 3000;

// To know the server is running
app.listen(PORT, () => {
  console.log(`Your sever is running on port ${PORT}`);
});
