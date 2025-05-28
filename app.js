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

app.use(express.json({limit: '10kb'}));

app.use(bodyParser.json({}));

app.use(bodyParser.urlencoded({extended:true}));

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

// ✅ Corrected middleware: apply CORS headers before serving static files
app.use(
  '/uploads',
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Or specify your frontend URL if needed
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  },
  express.static(path.join(__dirname, 'uploads'))
);


// Add a route to check if files are accessible
app.get('/api/check-file', (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({
      status: 'error',
      message: 'URL parameter is required'
    });
  }
  
  // Extract the file path from the URL
  const filePath = url.startsWith('/') 
    ? path.join(__dirname, url) 
    : path.join(__dirname, '/', url);
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not accessible: ${filePath}`, err);
      return res.status(404).json({
        status: 'error',
        message: 'File not found',
        path: filePath,
        error: err.message
      });
    }
    
    console.log(`File is accessible: ${filePath}`);
    return res.status(200).json({
      status: 'success',
      message: 'File is accessible',
      path: filePath,
      url: url
    });
  });
});

// Add a direct file access route with proper content type detection
app.get('/api/media/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', 'media', filename);
  
  console.log('Media access request for:', filePath);
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`, err);
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.mp4') contentType = 'video/mp4';
    
    // Set appropriate headers for viewing in browser
    res.setHeader('Content-Type', contentType);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

// Add a route for direct file downloads
app.get('/api/download/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  
  // Validate type parameter
  if (type !== 'media' && type !== 'documents') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid file type'
    });
  }
  
  // Construct file path
  const filePath = path.join(__dirname, 'uploads', type, filename);
  
  console.log('Download request for file:', filePath);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`, err);
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }
    
    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

app.use(routes); 

module.exports = app;


