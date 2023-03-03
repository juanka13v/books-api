const Comment = require('../models/Comment')


const getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.find()

        if (!comments) {
            res.status(404).json({ status: 'error', message: 'comments not found' })
        }

        res.status(200).json({ status: 'success', comments })

    } catch (err) {
        next(err)
    }

};

const getComment = async (req, res, next) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);


        if (!comment)
            return res.status(404).json({ status: "error", message: "comment not found" });

        res.status(200).json({ status: 'success',comment })
    } catch (err) {
        next(err)
    }
};

const createComment = async (req, res, next) => {
    const newComment = new Comment(req.body);

    try {
        const saveComment = await newComment.save();
        res.status(201).json({ status: "created", comment: saveComment });
    } catch (err) {
        next(err)
    }
};

const deleteComment = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedSaga) {
            return res.status(404).json({ status: "error", message: "comment not exist" });
        }

        res.status(202).json({ status: "success", message: "comment eliminated" });
    } catch (err) {
        next(err)
    }

};

const updateComment = async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    try {
        const updatedComment = await Comment.findByIdAndUpdate(id, update, {
            new: true,
        });
        res.status(202).json({ status: "success", comment: updatedComment });
    } catch (err) {
        next(err)
    }
};

module.exports = {
    getAllComments,
    getComment,
    createComment,
    deleteComment,
    updateComment
};