const express = require("express");
const oddsApi = require("../services/odds-api");
const router = express.Router();

/* GET sports */
router.get("/", async (req, res, next) => {
    const response = await oddsApi.getSports(req.query.num_sports);
    res.status(200).json(response)
});

module.exports = router;
