const { StatusCodes } = require('http-status-codes');
const { NotFoundError, UnauthenticatedError } = require('../errors');
const Comment = require('../models/Comment')
const User = require('../models/User')


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

    const comment = await Comment.findById(id);

    if (!comment) throw new NotFoundError(`No comment with id: ${id}`)

    res.status(StatusCodes.OK).json({ status: 'success', comment })
};

const createComment = async (req, res, next) => {
    req.body.user = req.user.userId
    const comment = await Comment.create(req.body);

    const updatedUser = await User.findByIdAndUpdate(
        req.user.userId,
        { $push: { comments: comment._id } },
        { new: true }
    );

    res.status(StatusCodes.OK).json({ status: "created", comment });
};

const deleteComment = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId

    const comment = await Comment.findById(id);

    if (!comment) throw new NotFoundError(`No comment with id: ${id}`)

    if (comment.user != userId) throw new UnauthenticatedError('You are not authorized to delete this comment.')

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { comments: comment._id } },
        { new: true }
    );

    await Comment.findByIdAndDelete(id)

    res.status(StatusCodes.OK).json({ status: "success", message: "comment eliminated" });

};

const updateComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId
    const update = req.body;

    const comment = await Comment.findById(id);

    if (!comment) throw new NotFoundError(`No comment with id: ${id}`)

    if (comment.user != userId) throw new UnauthenticatedError('You are not authorized to update this comment.')

    const updatedComment = await Comment.findByIdAndUpdate(id, update, {
        new: true,
    });

    res.status(202).json({ status: "success", comment: updatedComment });
};

module.exports = {
    getAllComments,
    getComment,
    createComment,
    deleteComment,
    updateComment
};