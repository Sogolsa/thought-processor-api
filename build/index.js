"use strict";

var _express = _interopRequireDefault(require("express"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _yamljs = _interopRequireDefault(require("yamljs"));
var _routes = _interopRequireDefault(require("./src/routes/routes"));
require("./passport");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Load environment variables from .env file
_dotenv["default"].config();

// initializing express application
var app = (0, _express["default"])();
var allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

// Middleware setup
app.use((0, _cors["default"])({
  origin: function origin(_origin, callback) {
    if (!_origin || allowedOrigins.includes(_origin)) {
      callback(null, true); // Allow request
    } else {
      callback(new Error("Not allowed by CORS")); // block request
    }
  },
  credentials: true // Allow cookies/auth headers
}));
app.use(_express["default"].urlencoded({
  extended: true
})); // parses incoming requests with URL-encoded payloads (form data)
app.use(_express["default"].json()); //parses incoming requests with JSON payloads

// Connecting to the database locally
// mongoose
//   .connect('mongodb://localhost:27017/TOAdb', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB connected.'))
//   .catch((err) => console.log('MongoDB connection error: ', err));

// Connecting the application to mongoDB atlas
_mongoose["default"].connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log("MongoDB connected.");
})["catch"](function (err) {
  return console.log("MongoDB connection error: ", err);
});
app.use(function (req, res, next) {
  console.log("Incoming request: ".concat(req.method, " ").concat(req.url));
  next();
});

// Running the routes inside the app
(0, _routes["default"])(app);

// First Endpoint
app.use("/", function (req, res) {
  res.send("Welcome to Thought Tracking Journal API!");
});

//Importing Yaml file
var swaggerDocument = _yamljs["default"].load("./swagger.yaml");

//Setting up Swagger UI middleware
app.use("/api-docs", _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(swaggerDocument));
app.use(function (req, res) {
  console.log("Fallback handler triggered");
  res.status(404).send("Route not found.");
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Port setup
var PORT = process.env.PORT || 3000;

// To know the server is running
app.listen(PORT, function () {
  console.log("Your sever is running on port ".concat(PORT));
});
//# sourceMappingURL=index.js.map