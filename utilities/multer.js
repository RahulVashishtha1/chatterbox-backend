const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Media: images + videos
const mediaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chatterbox_uploads/media',
    resource_type: 'auto',
    allowed_formats: [
      'jpg', 'jpeg', 'png', 'gif', 'webp',
      'mp4', 'webm', 'mov', 'avi', 'mkv'
    ],
  },
});

// Documents: PDFs, office docs, text, etc.
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chatterbox_uploads/documents',
    resource_type: 'raw',
    // allowed_formats: [
    //   'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'
    // ],
  },
});

const uploadMedia = multer({ storage: mediaStorage });
const uploadDocument = multer({ storage: documentStorage });

module.exports = { uploadMedia, uploadDocument };