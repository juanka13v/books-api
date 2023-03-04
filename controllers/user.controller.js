const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')


const getAllUsers = async (req, res, next) => {
    const users = await User.find()

    if (users.length < 1) throw new NotFoundError(`No users found`)

    res.status(StatusCodes.OK).json({ status: 'success', users })
};

const getUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) throw new NotFoundError(`No user with id ${id}`)

    res.status(StatusCodes.OK).json({ user })
};

const createUser = async (req, res, next) => {
    const newUser = new User(req.body);
    const saveUser = await newUser.save();

    res.status(StatusCodes.CREATED).json({ status: "created", user: saveUser });
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) throw new NotFoundError(`No user with id ${jobId}`)

    res.status(StatusCodes.OK).json({ message: "user eliminated" });
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, update, {
        new: true,
    });

    if (!updatedUser) throw new NotFoundError(`No user with id ${id}`)

    res.status(StatusCodes.OK).json({ user: updatedUser });
};

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
};