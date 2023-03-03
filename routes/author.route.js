const express = require("express");
const router = express.Router();

const {
    getAllAuthors,
    getAuthor,
    createAuthor,
    deleteAuthor,
    updateAuthor  
} = require("../controllers/author.controller");


router.route("/authors").get(getAllAuthors).post(createAuthor);
router.route("/author/:id").get(getAuthor).put(updateAuthor).delete(deleteAuthor);


module.exports = router;