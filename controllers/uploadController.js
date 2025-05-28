const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Ensure upload directories exist
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
};

// Configure storage for media files
const mediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/media');
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

// Configure storage for document files
const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/documents');
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if the file type is allowed
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 
    'video/mp4', 'video/quicktime',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Create multer upload instances
const uploadMedia = multer({ 
  storage: mediaStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 16 * 1024 * 1024 } // 16MB
}).single('file');

const uploadDocument = multer({ 
  storage: documentStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('file');

// Media upload handler
exports.uploadMediaFile = (req, res) => {
  uploadMedia(req, res, function (err) {
    if (err) {
      console.error('Media upload error:', err);
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }
    
    console.log('Media file uploaded:', req.file);
    
    // Create a URL path for the file
    const filePath = `/uploads/media/${req.file.filename}`;
    
    // Return the file data
    return res.status(200).json({
      status: 'success',
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: filePath
      }
    });
  });
};

// Document upload handler
exports.uploadDocumentFile = (req, res) => {
  uploadDocument(req, res, function (err) {
    if (err) {
      console.error('Document upload error:', err);
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }
    
    console.log('Document file uploaded:', req.file);
    
    // Create a URL path for the file
    const filePath = `/uploads/documents/${req.file.filename}`;
    
    // Return the file data
    return res.status(200).json({
      status: 'success',
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: filePath
      }
    });
  });
};

// Export the multer middleware for use in routes
exports.uploadMedia = uploadMedia;
exports.uploadDocument = uploadDocument;

// Handle media upload (for use with routes)
exports.handleMediaUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded'
    });
  }
  
  console.log('Media file uploaded via route:', req.file);
  
  // Create a URL path for the file
  const filePath = `/uploads/media/${req.file.filename}`;
  
  // Return the file data
  return res.status(200).json({
    status: 'success',
    message: 'File uploaded successfully',
    data: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: filePath
    }
  });
};

// Handle document upload (for use with routes)
exports.handleDocumentUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded'
    });
  }
  
  console.log('Document file uploaded via route:', req.file);
  
  // Create a URL path for the file
  const filePath = `/uploads/documents/${req.file.filename}`;
  
  // Return the file data
  return res.status(200).json({
    status: 'success',
    message: 'File uploaded successfully',
    data: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: filePath
    }
  });
};
