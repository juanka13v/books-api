const Saga = require('../models/Saga')


const getAllSagas = async (req, res, next) => {
    try {
        const sagas = await Saga.find()

        if (!sagas) {
            res.status(404).json({ status: 'error', message: 'sagas not found' })
        }

        res.status(200).json({ status: 'success', sagas })

    } catch (err) {
        next(err)
    }

};

const getSaga = async (req, res, next) => {
    const { id } = req.params;

    try {
        const saga = await Saga.findById(id);


        if (!saga)
            return res.status(404).json({ status: "error", message: "saga not found" });

        res.status(200).json({ status: 'success', saga })
    } catch (err) {
        next(err)
    }
};

const createSaga = async (req, res, next) => {
    const newSaga = new Saga(req.body);

    try {
        const saveSaga = await newSaga.save();
        res.status(201).json({ status: "created", saga: saveSaga });
    } catch (err) {
        next(err)
    }
};

const deleteSaga = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedSaga = await Saga.findByIdAndDelete(id);
        if (!deletedSaga) {
            return res.status(404).json({ status: "error", message: "saga not exist" });
        }

        res.status(202).json({ status: "success", message: "saga eliminated" });
    } catch (err) {
        next(err)
    }

};

const updateSaga = async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    try {
        const updatedSaga = await Saga.findByIdAndUpdate(id, update, {
            new: true,
        });
        res.status(202).json({ status: "success", saga: updatedSaga });
    } catch (err) {
        next(err)
    }
};

module.exports = {
    getAllSagas,
    getSaga,
    createSaga,
    deleteSaga,
    updateSaga
};