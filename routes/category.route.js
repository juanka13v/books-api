const express = require("express");
const router = express.Router();
const paginate = require("../utils/paginate");
const Category = require("../models/Category");

const {
  getAllCategories,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/category.controller");

router
  .route("/categories")
  .get(paginate(Category), getAllCategories)
  .post(createCategory);
router
  .route("/category/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
