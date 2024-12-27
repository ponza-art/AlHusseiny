const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allow images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

// Create multer instance with configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Middleware for single file upload
exports.uploadSingle = (fieldName) => upload.single(fieldName);

// Middleware for multiple files upload
exports.uploadMultiple = (fieldName, maxCount) => upload.array(fieldName, maxCount);

// Error handling middleware for upload
exports.handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File too large. Maximum size is 5MB'
            });
        }
        return res.status(400).json({
            message: err.message
        });
    }
    
    if (err) {
        return res.status(400).json({
            message: err.message
        });
    }
    
    next();
};

// Middleware to validate uploaded files
exports.validateUpload = (req, res, next) => {
    if (!req.file && !req.files) {
        return res.status(400).json({
            message: 'Please upload a file'
        });
    }
    next();
}; 