const Author = require('../models/Author')
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors')
const { deleteImage, uploadImage } = require('../utils/cloudinary')


const getAllAuthors = async (req, res, next) => {
    const { totalCount } = res.paginateResults

    if (totalCount < 1) throw new NotFoundError(`No authors found.`)

    res.status(StatusCodes.OK).json(res.paginateResults)
};

const getAuthor = async (req, res, next) => {
    const { id } = req.params;
    const author = await Author.findById(id);

    if (!author) throw new NotFoundError(`No author with id ${id}`)

    res.status(StatusCodes.OK).json({ status: 'success', author })
};

const createAuthor = async (req, res, next) => {
    const author = new Author(req.body);

    if (req.files?.image) {
        const result = await uploadImage(req.files.image.tempFilePath, author.name, 'Authors-images')
        author.image = {
            id: result.public_id,
            url: result.secure_url
        }
        await fs.unlink(req.files.image.tempFilePath)
    }

    const saveAuthor = await author.save();

    res.status(StatusCodes.CREATED).json({ status: "created", author: saveAuthor });
};

const deleteAuthor = async (req, res, next) => {
    const { id } = req.params;
    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) throw new NotFoundError(`No author with id ${id}`)

    await deleteImage(deletedAuthor.image.id)

    res.status(StatusCodes.OK).json({ status: "success", message: "author eliminated" });
};

const updateAuthor = async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    const author = await Author.findById(id)

    if (!author) throw new NotFoundError(`No author with id ${id}`)

    if (req.files?.image) {
        await deleteImage(author.image.id)
        const result = await uploadImage(req.files.image.tempFilePath, author.name, 'Authors-images')
        update.image = {
            id: result.public_id,
            url: result.secure_url
        }
        await fs.unlink(req.files.image.tempFilePath)
    }

    const updatedAuthor = await Author.findByIdAndUpdate(id, update, {
        new: true,
    });


    res.status(StatusCodes.OK).json({ status: "success", author: updatedAuthor });
};

module.exports = {
    getAllAuthors,
    getAuthor,
    createAuthor,
    deleteAuthor,
    updateAuthor
};