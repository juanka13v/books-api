const Saga = require('../models/Saga')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')

const getAllSagas = async (req, res, next) => {
    const {totalCount} = res.paginateResults

    if (totalCount < 1) throw new NotFoundError(`No sagas found`)

    res.status(StatusCodes.OK).json(res.paginateResults)
};

const getSaga = async (req, res, next) => {
    const { id } = req.params;
    const saga = await Saga.findById(id);


    if (!saga) throw new NotFoundError(`No saga with id: ${id}`)

    res.status(StatusCodes.OK).json({ status: 'success', saga })
};

const createSaga = async (req, res, next) => {
    const newSaga = new Saga(req.body);
    const saveSaga = await newSaga.save();

    res.status(StatusCodes.CREATED).json({ status: "created", saga: saveSaga });
};

const deleteSaga = async (req, res, next) => {
    const { id } = req.params;
    const deletedSaga = await Saga.findByIdAndDelete(id);

    if (!deletedSaga) throw new NotFoundError(`No saga with id ${id}`)

    res.status(StatusCodes.OK).json({ status: "success", message: "saga eliminated" });
};

const updateSaga = async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    const updatedSaga = await Saga.findByIdAndUpdate(id, update, {
        new: true,
    });

    if (!updatedSaga) throw new NotFoundError(`No saga with id ${id}`)

    res.status(StatusCodes.OK).json({ status: "success", saga: updatedSaga });
};

module.exports = {
    getAllSagas,
    getSaga,
    createSaga,
    deleteSaga,
    updateSaga
};