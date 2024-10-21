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

// Importing Yaml file
var swaggerDocument = _yamljs["default"].load('./swagger.yaml');

// Setting up Swagger UI middleware
app.use('/api-docs', _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(swaggerDocument));

// Middleware setup
app.use((0, _cors["default"])());
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
_mongoose["default"].connect(process.env.CONNECTION_URI).then(function () {
  return console.log('MongoDB connected.');
})["catch"](function (err) {
  return console.log('MongoDB connection error: ', err);
});

// Running the routes inside the app
(0, _routes["default"])(app);

// First Endpoint
app.use('/', function (req, res) {
  res.send('Welcome to Thought Tracking Journal API!');
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Port setup
var PORT = process.env.PORT || 3000;

// To know the server is running
app.listen(PORT, function () {
  console.log("Your sever is running on port ".concat(PORT));
});
//# sourceMappingURL=index.js.map