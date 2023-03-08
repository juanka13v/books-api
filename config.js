module.exports = {
    PORT: process.env["PORT"] || 3000,
    MONGO_KEY: process.env["MONGO_KEY"],
    CLOUDINARY_CLOUD_NAME: process.env['CLOUDINARY_CLOUD_NAME'],
    CLOUDINARY_API_SECRET: process.env['CLOUDINARY_API_SECRET'],
    CLOUDINARY_API_KEY: process.env['CLOUDINARY_API_KEY']
}