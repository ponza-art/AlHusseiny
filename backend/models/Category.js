const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    image: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create slug before saving
categorySchema.pre('save', function(next) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    next();
});

module.exports = mongoose.model('Category', categorySchema); 