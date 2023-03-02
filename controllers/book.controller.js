const Book = require('../models/Book')


const getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find()

        if (!books) {
            res.status(404).json({ status: 'error', message: 'books not found' })
        }

        res.status(200).json({ status: 'success', books })

    } catch (err) {
        next(err)
    }

};

const getBook = async (req, res, next) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);


        if (!book)
            return res.status(404).json({ status: "error", message: "book not found" });

        res.status(200).json({ status: 'success', book })
    } catch (err) {
        next(err)
    }
};

const createBook = async (req, res, next) => {
    const newBook = new Book(req.body);

    try {
        const saveBook = await newBook.save();
        res.status(201).json({ status: "created", book: saveBook });
    } catch (err) {
        next(err)
    }
};

const deleteBook = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ status: "error", message: "book not exist" });
        }

        res.status(203).json({ status: "success", message: "book eliminated" });
    } catch (err) {
        next(err)
    }

};

const updateBook = async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    try {
        const updatedBook = await Book.findByIdAndUpdate(id, update, {
            new: true,
        });
        res.status(203).json({ status: "success", book: updatedBook });
    } catch (err) {
        next(err)
    }
};

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    deleteBook,
    updateBook
};