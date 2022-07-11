const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
var cors = require("cors");
app.use(cors());

global.lang = ["en", "ch"];

//DEFAULT PAGE LIMIT
global.row_count = 5;

const login = require("./api/routes/login");
const books = require("./api/routes/books");

const username = "sampleId";
const password = "Secret";

global.username = username;
global.password = password;

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "25mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "25mb",
    extended: true,
    parameterLimit: 25000,
  })
);
app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  req.header("Access-Control-Allow-Credentials", "true");
  req.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  req.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
  );
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

var getIP = require("ipware")().get_ip;
app.use(function (req, res, next) {
  var ipInfo = getIP(req);
  console.log(ipInfo);
  next();
});

app.use("/login", requestParams, login);
app.use("/books", requestParams, verifyToken, books);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
function verifyToken(req, res, next) {
  var bearerToken = getBearer(req);
  if (bearerToken) {
    var user = jwt.decode(bearerToken);
    if (user) {
      req.userDataFromToken = user.data;
      next();
    } else {
      res.status(401).json({
        message: "invalid_token",
      });
    }
  } else {
    res.status(401).json({
      message: "invalid_token",
    });
  }
}

function getBearer(req) {
  var bearerToken = false;
  // const bearerHeader = req.headers["Authorization"];
  const bearerHeader = req.headers["authorization"];
  console.log('bearerHeader',bearerHeader)
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];
  }
  return bearerToken;
}

function requestParams(req, res, next) {
  console.log("params", req.params, "body", req.body);
  next();
}
module.exports = app;
