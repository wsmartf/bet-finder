const axios = require("axios");
const GameInfo = require('../models/game-info');
const config = require('../config');

const API_URL = "https://api.the-odds-api.com/v4/sports";
const API_KEY = config.API_KEY;
const REGIONS = "US"
const MARKETS = "h2h"
const ODDS_FORMAT = "american"
const BOOKMAKERS = "fanduel,draftkings,williamhill_us"
const CACHE_LOCATION = "../cached-responses/response.json"

const fs = require('fs');

getSports = async (numSports) => {
    const response = await axios
        .get(API_URL, {
            params: {
                apiKey: API_KEY,
            },
        })
    return mapSportsKeys(response.data, numSports);
};

getOdds = async (query) => {
    const sportKey = query.sport;
    const useCachedResponse = query.use_cached_response ? query.use_cached_response == 'true' : false;

    let oddsRequest;
    if (useCachedResponse) {
        oddsRequest = await loadDataJson(CACHE_LOCATION);
    } else {
        try {
        const data = await callOddsApi(sportKey);
        let currentDateTime = new Date();
        let gamesData = data
            .filter(gameResponse => (new Date(gameResponse.commence_time)) - currentDateTime >= 0)
            .map(gameData => new GameInfo(gameData));
        const gamesDataSorted = gamesData.sort((a, b) => b.best_conversion - a.best_conversion);
        oddsRequest = gamesDataSorted.map(game => game.getPropertiesForJSON());
        writeDataJson(CACHE_LOCATION, oddsRequest);

        } catch (error) {
            console.log(error)
            oddsRequest = [ { "error": "Error retrieving odds data" } ]
        }
    }

    return oddsRequest;
}

callOddsApi = async (sportKey) => {
    console.log("API KEY !!!!!!!!!!" + API_KEY)
    const response = await axios
        .get(`${API_URL}/${sportKey}/odds`, {
            params: {
                apiKey: API_KEY,
                regions: REGIONS,
                markets: MARKETS,
                oddsFormat: ODDS_FORMAT,
                bookmakers: BOOKMAKERS,
            },
        })
    return response.data;
}

writeDataJson = (path, data) => {
    fileContents = JSON.stringify(data);
    fs.writeFile(path, fileContents, 'utf8', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("File written successfully");
        }
    });
}

loadDataJson = (path) => {
    data = '[]';

    if (!fs.existsSync(path)) {
        console.log("File not found");
    } else {
        data = fs.readFileSync(path, 'utf8');
        console.log("Data loaded successfully");
    }
    return JSON.parse(data);
}

mapSportsKeys = (data, numSports) => {
    let sports;
    if (numSports) {
        sports = data.slice(0, numSports).map(sport => sport.key);
    } else {
        sports = data.map(sport => sport.key);
    }
    return { "sports": sports };
}

module.exports = {
    getSports,
    getOdds,
};