const cloudinary = require('cloudinary').v2
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY } = require('../config.js')

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
})


const uploadImage = async (filePath, folder, mainFolder) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: `${mainFolder}/${folder.replace(/ /g, "-")}`
    })
}

const deleteImage = async (id) => {
    return await cloudinary.uploader.destroy(id)
}

module.exports = {
    uploadImage,
    deleteImage
}