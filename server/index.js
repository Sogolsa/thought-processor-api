import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";

import routes from "./src/routes/routes";
import "./passport";

// Load environment variables from .env file
dotenv.config();

// initializing express application
const app = express();

// Middleware setup
app.use(
  cors({
    origin: "https://mind-organizer-easy-journaling.vercel.app/",
    credentials: true, // Allow cookies/auth headers
  })
);
app.use(express.urlencoded({ extended: true })); // parses incoming requests with URL-encoded payloads (form data)
app.use(express.json()); //parses incoming requests with JSON payloads

// Connecting to the database locally
// mongoose
//   .connect('mongodb://localhost:27017/TOAdb', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB connected.'))
//   .catch((err) => console.log('MongoDB connection error: ', err));

// Connecting the application to mongoDB atlas
mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.log("MongoDB connection error: ", err));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Running the routes inside the app
routes(app);

// First Endpoint
app.use("/", (req, res) => {
  res.send("Welcome to Thought Tracking Journal API!");
});

//Importing Yaml file
const swaggerDocument = yaml.load("./swagger.yaml");

//Setting up Swagger UI middleware
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  console.log("Fallback handler triggered");
  res.status(404).send("Route not found.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Port setup
const PORT = process.env.PORT || 3000;

// To know the server is running
app.listen(PORT, () => {
  console.log(`Your sever is running on port ${PORT}`);
});
