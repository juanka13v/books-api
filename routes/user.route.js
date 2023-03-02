const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser  
} = require("../controllers/user.controller");


router.route("/users").get(getAllUsers).post(createUser);
router.route("/user/:id").get(getUser).put(updateUser).delete(deleteUser);


module.exports = router;