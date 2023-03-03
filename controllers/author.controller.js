const Author = require('../models/Author')


const getAllAuthors = async (req, res, next) => {
    try {
        const authors = await Author.find()

        if (!authors) {
            res.status(404).json({ status: 'error', message: 'authors not found' })
        }

        res.status(200).json({ status: 'success', authors })

    } catch (err) {
        next(err)
    }

};

const getAuthor = async (req, res, next) => {
    const { id } = req.params;

    try {
        const author = await Author.findById(id);


        if (!author)
            return res.status(404).json({ status: "error", message: "author not found" });

        res.status(200).json({ status: 'success', author })
    } catch (err) {
        next(err)
    }
};

const createAuthor = async (req, res, next) => {
    const newAuthor = new Author(req.body);
    console.log(req.body);

    try {
        const saveAuthor = await newAuthor.save();
        res.status(201).json({ status: "created", author: saveAuthor });
    } catch (err) {
        next(err)
    }
};

const deleteAuthor = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedAuthor = await Author.findByIdAndDelete(id);
        if (!deletedAuthor) {
            return res.status(404).json({ status: "error", message: "author not exist" });
        }

        res.status(202).json({ status: "success", message: "author eliminated" });
    } catch (err) {
        next(err)
    }

};

const updateAuthor = async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    try {
        const updatedAuthor = await Author.findByIdAndUpdate(id, update, {
            new: true,
        });
        res.status(202).json({ status: "success", author: updatedAuthor });
    } catch (err) {
        next(err)
    }
};

module.exports = {
    getAllAuthors,
    getAuthor,
    createAuthor,
    deleteAuthor,
    updateAuthor
};