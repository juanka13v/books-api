const express = require("express");
const router = express.Router();

const {
    getAllBooks,
    getBook,
    createBook,
    deleteBook,
    updateBook  
} = require("../controllers/book.controller");


router.route("/books").get(getAllBooks).post(createBook);
router.route("/book/:id").get(getBook).put(updateBook).delete(deleteBook);


module.exports = router;