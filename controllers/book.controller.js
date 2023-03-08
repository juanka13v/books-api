const Book = require('../models/Book')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')
const { uploadImage, deleteImage } = require('../utils/cloudinary')
const fs = require('fs-extra')

const getAllBooks = async (req, res, next) => {
    const { totalCount } = res.paginatedResults
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
    const book = new Book(req.body);

    if (req.files?.image) {
        const result = await uploadImage(req.files.image.tempFilePath, book.title, 'Books-images')
        book.image = {
            id: result.public_id,
            url: result.secure_url
        }
        await fs.unlink(req.files.image.tempFilePath)
    }

    const saveBook = await book.save();

    res.status(StatusCodes.CREATED).json({ status: "created", book });
};

const deleteBook = async (req, res, next) => {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) throw new NotFoundError(`No book with id: ${id}`)

    await deleteImage(deletedBook.image.id)

    res.status(StatusCodes.OK).json({ status: "success", message: `Deleted book with id: ${id}` });
};

const updateBook = async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    const book = await Book.findById(id)

    if (!book) throw new NotFoundError(`No book with id ${id}`)

    if (req.files?.image) {
        await deleteImage(book.image.id)
        const result = await uploadImage(req.files.image.tempFilePath, book.title, 'Books-images')
        update.image = {
            id: result.public_id,
            url: result.secure_url
        }
        await fs.unlink(req.files.image.tempFilePath)
    }

    const updatedBook = await Book.findByIdAndUpdate(id, update, {
        new: true,
    });

    res.status(StatusCodes.OK).json({ status: "success", book: updatedBook });
};

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    deleteBook,
    updateBook
};