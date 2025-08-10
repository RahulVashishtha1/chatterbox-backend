require('./utils/loadEnv')();
const express = require("express")
const morgan = require("morgan")
const path = require("path")
const fs = require("fs")

const routes = require("./routes/index");

const rateLimit = require("express-rate-limit") // Basic rate limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset.

const helmet = require("helmet") // Helps protect Express apps from common web vulnerabilities by setting HTTP

const mongosanitize = require("express-mongo-sanitize") // this package searchess for any user input and removes any special characters that could be used for SQL injection or NoSQL injection

const xss = require("xss-clean") // Node.js middleware that removes any malicious code from user input before it is sent to the server.
//sanitizes user input coming from POST body, GET queries, and url parsers.

const bodyParser = require("body-parser") // middleware that parses the body of a request, and populates the req.body object with the parsed data from the request body.

const cors = require("cors") // middleware that enables CORS with various options.

const cookieParser = require("cookie-parser") // middleware that parses cookie header and populates req.cookies object.

const session = require("cookie-session") // middleware that enables session management with cookies.


const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "PATCH", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)

app.use( cookieParser());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  helmet({
    crossOriginResourcePolicy: false, // disable the header, or
    // or use this to allow cross-origin:
    // crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(morgan("dev"));

const limiter = rateLimit({   //to limit the api calls on our server
      max: 3000,
      windowMs : 60 * 60 * 1000,  //in one hour 
      message : "Too many requests from this IP, please try again in an hour "
});

app.use("/api", limiter);

app.use(express.urlencoded({
    extended: true,
}))

app.use(mongosanitize());

app.use(xss());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic root and health endpoints for uptime checks and human-friendly root
app.get('/', (req, res) => {
  res.status(200).send('ChatterBox API is running');
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use(routes); 

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    error: err
  });
});

module.exports = app;