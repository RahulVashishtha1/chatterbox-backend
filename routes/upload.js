const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Upload media route
router.post('/media', uploadController.uploadMedia, uploadController.handleMediaUpload);

// Upload document route
router.post('/document', uploadController.uploadDocument, uploadController.handleDocumentUpload);

module.exports = router;

