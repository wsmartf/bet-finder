const express = require("express");
const oddsApi = require("../services/odds-api");
const router = express.Router();

/*
sport_key=
basketball_nba
basketball_ncaab
icehockey_nhl
*/

/* GET odds */
router.get("/", async (req, res, next) => {
    if (!req.query.sport) {
        res.status(400).json({ error: "Missing sport query parameter" })
    }
    
    const response = await oddsApi.getOdds(req.query);
    res.status(200).json(response)
});

module.exports = router;
