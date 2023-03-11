const Saga = require('../models/Saga')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')
const { deleteImage, uploadImage } = require('../utils/cloudinary')
const fs = require('fs-extra')

const getAllSagas = async (req, res) => {
    const { totalCount } = res.paginatedResults

    if (totalCount < 1) throw new NotFoundError(`No sagas found`)

    res.status(StatusCodes.OK).json(res.paginatedResults)
};

const getSaga = async (req, res) => {
    const { id } = req.params;
    const saga = await Saga.findById(id);


    if (!saga) throw new NotFoundError(`No saga with id: ${id}`)

    res.status(StatusCodes.OK).json({ status: 'success', saga })
};

const createSaga = async (req, res) => {
    const saga = new Saga(req.body);

    const images = [];

    if (req.files?.images) {
        await Promise.all(req.files.images.map(async file => {
            const result = await uploadImage(file.tempFilePath, saga.name, 'Sagas-images');
            images.push({
                id: result.public_id,
                url: result.secure_url
            });
            await fs.unlink(file.tempFilePath);
        }));

        saga.images = images;
    }

    const saveSaga = await saga.save();

    res.status(StatusCodes.CREATED).json({ status: "created", saga: saveSaga });
};


const deleteSaga = async (req, res) => {
    const { id } = req.params;

    const deletedSaga = await Saga.findByIdAndDelete(id);

    if (!deletedSaga) throw new NotFoundError(`No saga with id ${id}`);

    if (deletedSaga.images && deletedSaga?.images.length > 0) {
        const imageIds = deletedSaga.images.map((image) => image.id);
        const deletePromises = imageIds.map((imageId) => deleteImage(imageId));
        await Promise.all(deletePromises);
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        message: "saga eliminated",
    });
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

const deleteImgSaga = async (req, res) => {
    const { id } = req.params
    const { img } = req.query;

    if (!img) throw new BadRequestError('You have not entered the image id to delete.')

    const imgDeleted = await deleteImage(img)

    if (imgDeleted.result != 'ok') throw new NotFoundError(`No img with id: "${img}"`)

    const removeImage = await Saga.findByIdAndUpdate(
        id,
        { $pull: { images: { id: img } } },
        { new: true }
    )

    return res.status(StatusCodes.OK).json({ status: 'success', message: `The image with ID:${img} has been deleted.`, saga: removeImage })
}

const addImgSaga = async (req, res) => {
    const { id } = req.params

    if (!req.files?.images) throw new BadRequestError('You have not entered the image to update.')

    const saga = await Saga.findById(id)

    if (!saga) throw new NotFoundError(`No saga with id ${id}`)

    const result = await uploadImage(req.files.images.tempFilePath, saga.name, 'Sagas-images')

    const addImage = await Saga.findByIdAndUpdate(
        id,
        { $push: { images: { id: result.public_id, url: result.secure_url } } },
        { new: true }
    )

    await fs.unlink(req.files.images.tempFilePath)

    return res.status(StatusCodes.OK).json({ status: 'success', message: `The image with ID:${result.public_id} has been added.`, saga: addImage })

}

module.exports = {
    getAllSagas,
    getSaga,
    createSaga,
    deleteSaga,
    updateSaga,
    deleteImgSaga,
    addImgSaga
};