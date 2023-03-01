const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
        },
        books: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
            },
        ],
        avatar: {
            type: String,
        },
    },
    { timestamps: true }
);

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
