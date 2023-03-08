const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    summary: String,
    image: {
        image_id: String,
        url: String
    },
    publication_date: {
        type: Date,
        required: true
    },
    num_pages: {
        type: Number,
        required: true
    },
    publisher: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;