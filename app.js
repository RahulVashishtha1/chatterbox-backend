const express = require("express")
const morgan = require("morgan")

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

app.use(express.json({limit: '10kb'}));

app.use(bodyParser.json({}));

app.use(bodyParser.urlencoded({extended:true}));

app.use(helmet());

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

// TODO add routes

module.exports = app;