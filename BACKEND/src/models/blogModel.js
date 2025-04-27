const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Reference to the Category model
            required: [true, 'Category is required'],
        },
        image: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Blog', blogSchema);