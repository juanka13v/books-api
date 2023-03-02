const User = require('../models/User')


const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()

        if (!users) {
            res.status(404).json({ status: 'error', message: 'users not found' })
        }

        res.status(200).json({ status: 'success', users })

    } catch (err) {
        next(err)
    }

};

const getUser = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    try {
        const user = await User.findById(id);


        if (!user)
            return res.status(404).json({ status: "error", message: "user not found" });

        res.status(200).json({ user })
    } catch (err) {
        next(err)
    }
};

const createUser = async (req, res, next) => {
    const newUser = new User(req.body);

    try {
        const saveUser = await newUser.save();
        res.status(201).json({ status: "created", user: saveUser });
    } catch (err) {
        next(err)
    }
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ status: "error", message: "user not found" });
        }

        res.status(203).json({ status: "success", message: "user eliminated" });
    } catch (err) {
        next(err)
    }

};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, update, {
            new: true,
        });
        res.status(203).json({ status: "success", user: updatedUser });
    } catch (err) {
        next(err)
    }
};

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
};