const Saga = require('../models/Saga')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')
const { deleteImage, uploadImage } = require('../utils/cloudinary')
const fs = require('fs-extra')

const getAllSagas = async (req, res, next) => {
    const { totalCount } = res.paginateResults

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
    const saga = new Saga(req.body);

    const images = [];

    if (req.files?.images) {
        for (const file of req.files.images) {
            const result = await uploadImage(file.tempFilePath, saga.name, 'Sagas-images')
            images.push({
                id: result.public_id,
                url: result.secure_url
            })

            await fs.unlink(file.tempFilePath)
        }

        saga.images = images
    }


    const saveSaga = await saga.save();

    res.status(StatusCodes.CREATED).json({ status: "created", saga: saveSaga });
};

const deleteSaga = async (req, res, next) => {
    const { id } = req.params;
    const deletedSaga = await Saga.findByIdAndDelete(id);

    if (!deletedSaga) throw new NotFoundError(`No saga with id ${id}`)

    for (const img of deletedSaga.images) {
        await deleteSaga(img.id)
    }

    res.status(StatusCodes.OK).json({ status: "success", message: "saga eliminated" });
};

const updateSaga = async (req, res) => {
    const { id } = req.params;
    const { img_id } = req.query;
    const update = req.body;


    const saga = await Saga.findById(id)

    if (!saga) throw new NotFoundError(`No saga with id ${id}`)

    if (img_id) {
        const imgDeleted = await deleteImage(img_id)

        if(imgDeleted.result != 'ok') throw new NotFoundError(`No img with id: "${img_id}"`)

        const removeImage = await Saga.findByIdAndUpdate(
            id,
            { $pull: { images: { id: img_id } } },
            { new: true }
        )

        return res.status(StatusCodes.OK).json({ status: 'success', message: `The image with ID:${img_id} has been deleted.`, saga: removeImage })
    }

    if (req.files?.images) {
        const result = await uploadImage(req.files.images.tempFilePath, saga.name, 'Sagas-images')

        const addImage = await Saga.findByIdAndUpdate(
            id,
            { $push: { images: { id: result.public_id, url: result.secure_url } } },
            { new: true }
        )

        await fs.unlink(req.files.images.tempFilePath)

        return res.status(StatusCodes.OK).json({ status: 'success', message: `The image with ID:${result.public_id} has been added.`, saga: addImage })
    }


    const updatedSaga = await Saga.findByIdAndUpdate(id, update, {
        new: true,
    });


    res.status(StatusCodes.OK).json({ status: "success", saga: updatedSaga });
};

module.exports = {
    getAllSagas,
    getSaga,
    createSaga,
    deleteSaga,
    updateSaga
};