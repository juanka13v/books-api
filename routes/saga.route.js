const express = require("express");
const router = express.Router();

const {
    getAllSagas,
    getSaga,
    createSaga,
    deleteSaga,
    updateSaga  
} = require("../controllers/saga.controller");


router.route("/sagas").get(getAllSagas).post(createSaga);
router.route("/saga/:id").get(getSaga).put(updateSaga).delete(deleteSaga);


module.exports = router;