const Category = require("../models/Category");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const { uploadImage, deleteImage } = require("../utils/cloudinary");
const fs = require("fs-extra");

const getAllCategories = async (req, res) => {
  const { totalCount } = res.paginatedResults;
  if (totalCount < 1) throw new NotFoundError("No categories found.");

  res.status(StatusCodes.OK).json(res.paginatedResults);
};

const getCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) throw new NotFoundError(`No category with id: ${id}`);

  res.status(StatusCodes.OK).json({ status: "success", category });
};

const createCategory = async (req, res) => {
  const category = new Category(req.body);

  if (req.files?.image) {
    const result = await uploadImage(
      req.files.image.tempFilePath,
      category.name,
      "Categories-images"
    );
    category.image = {
      id: result.public_id,
      url: result.secure_url,
    };
    await fs.unlink(req.files.image.tempFilePath);
  }

  const saveCategory = await category.save();

  res.status(StatusCodes.CREATED).json({ status: "created", saveCategory });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id);

  if (!deletedCategory) throw new NotFoundError(`No category with id: ${id}`);

  await deleteImage(deletedCategory.image.id);

  res
    .status(StatusCodes.OK)
    .json({ status: "success", message: `Deleted category with id: ${id}` });
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  const category = await Category.findById(id);

  if (!category) throw new NotFoundError(`No book with id ${id}`);

  if (req.files?.image) {
    await deleteImage(category.image.id);
    const result = await uploadImage(
      req.files.image.tempFilePath,
      category.name,
      "Categories-images"
    );
    update.image = {
      id: result.public_id,
      url: result.secure_url,
    };
    await fs.unlink(req.files.image.tempFilePath);
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, update, {
    new: true,
  });

  res
    .status(StatusCodes.OK)
    .json({ status: "success", category: updatedCategory });
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
};
