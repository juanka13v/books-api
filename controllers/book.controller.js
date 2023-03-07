const Book = require('../models/Book')

const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')
const paginate = require('../utils/paginate');


const getAllBooks = async (req, res, next) => {
    const {totalCount} = res.paginatedResults
    if (totalCount < 1) throw new NotFoundError('No books found.')

    res.status(StatusCodes.OK).json(res.paginatedResults)
};

const getBook = async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) throw new NotFoundError(`No book with id: ${id}`)

    res.status(StatusCodes.OK).json({ status: 'success', book })
};

const createBook = async (req, res, next) => {
    const newBook = new Book(req.body);
    const saveBook = await newBook.save();

    res.status(StatusCodes.CREATED).json({ status: "created", book: saveBook });
};

const deleteBook = async (req, res, next) => {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) throw new NotFoundError(`No book with id: ${id}`)

    res.status(StatusCodes.OK).json({ status: "success", message: `Deleted book with id: ${id}` });
};

const updateBook = async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    const updatedBook = await Book.findByIdAndUpdate(id, update, {
        new: true,
    });

    if (!updatedBook) throw new NotFoundError(`No book with id ${id}`)

    res.status(StatusCodes.OK).json({ status: "success", book: updatedBook });
};

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    deleteBook,
    updateBook
};