const express = require("express");
const router = express.Router();

const Saga = require('../models/Saga')
const paginate = require('../utils/paginate')

const {
    getAllSagas,
    getSaga,
    createSaga,
    deleteSaga,
    updateSaga
} = require("../controllers/saga.controller");


router.route("/sagas").get(paginate(Saga), getAllSagas).post(createSaga);
router.route("/saga/:id").get(getSaga).put(updateSaga).delete(deleteSaga);


module.exports = router;