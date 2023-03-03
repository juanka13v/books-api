const express = require("express");
const router = express.Router();

const {
    getAllComments,
    getComment,
    createComment,
    deleteComment,
    updateComment  
} = require("../controllers/comment.controller");


router.route("/comments").get(getAllComments).post(createComment);
router.route("/comment/:id").get(getComment).put(updateComment).delete(deleteComment);


module.exports = router;