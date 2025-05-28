const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const path = require('path');
const fs = require('fs');

// Upload media route
router.post('/media', uploadController.uploadMedia, uploadController.handleMediaUpload);

// Upload document route
router.post('/document', uploadController.uploadDocument, uploadController.handleDocumentUpload);

// Serve media files directly
router.get('/media/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/media', filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    } else {
        return res.status(404).json({
            status: 'error',
            message: 'File not found'
        });
    }
});

// Serve document files directly
router.get('/document/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/documents', filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    } else {
        return res.status(404).json({
            status: 'error',
            message: 'File not found'
        });
    }
});

// Download media files
router.get('/download/media/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/media', filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
        return res.download(filePath, filename);
    } else {
        return res.status(404).json({
            status: 'error',
            message: 'File not found'
        });
    }
});

// Download document files
router.get('/download/document/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/documents', filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
        return res.download(filePath, filename);
    } else {
        return res.status(404).json({
            status: 'error',
            message: 'File not found'
        });
    }
});

module.exports = router;

