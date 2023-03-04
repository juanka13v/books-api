const Author = require('../models/Author')
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors')


const getAllAuthors = async (req, res, next) => {
    const authors = await Author.find()

    if (authors.length < 1) throw new NotFoundError(`No authors found.`)

    res.status(StatusCodes.OK).json({ status: 'success', authors })
};

const getAuthor = async (req, res, next) => {
    const { id } = req.params;
    const author = await Author.findById(id);

    if (!author) throw new NotFoundError(`No author with id ${id}`)

    res.status(StatusCodes.OK).json({ status: 'success', author })
};

const createAuthor = async (req, res, next) => {
    const newAuthor = new Author(req.body);
    const saveAuthor = await newAuthor.save();

    res.status(StatusCodes.CREATED).json({ status: "created", author: saveAuthor });
};

const deleteAuthor = async (req, res, next) => {
    const { id } = req.params;
    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) throw new NotFoundError(`No author with id ${id}`)

    res.status(StatusCodes.OK).json({ status: "success", message: "author eliminated" });
};

const updateAuthor = async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    const updatedAuthor = await Author.findByIdAndUpdate(id, update, {
        new: true,
    });

    if (!updateAuthor) throw new NotFoundError(`No author with id ${id}`)

    res.status(StatusCodes.OK).json({ status: "success", author: updatedAuthor });
};

module.exports = {
    getAllAuthors,
    getAuthor,
    createAuthor,
    deleteAuthor,
    updateAuthor
};