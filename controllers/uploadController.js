const { uploadMedia: mediaUploader, uploadDocument: documentUploader } = require('../utilities/multer');

// Media upload handler
exports.uploadMedia = mediaUploader.single('file');
exports.handleMediaUpload = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: req.file.path,
        public_id: req.file.filename
      }
    });
  } catch (err) {
    console.error('Media upload error:', err, err && err.stack);
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Unknown error',
      error: err
    });
  }
};

// Document upload handler
exports.uploadDocument = documentUploader.single('file');
exports.handleDocumentUpload = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: req.file.path,
        public_id: req.file.filename
      }
    });
  } catch (err) {
    console.error('Document upload error:', err, err && err.stack);
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Unknown error',
      error: err
    });
  }
};
