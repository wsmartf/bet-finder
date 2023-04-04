
class GameInfo {
    constructor(gameData) {
        try {
            gameData.bookmakers[0].markets[0].outcomes
        } catch (e) {
            console.log(e);
            return null;
        }

        this.gameTime = new Date(gameData.commence_time);
        this.local_time = this.gameTime.toLocaleString();
        this.underdog, this.favorite;
        this.underdogOddsByBook, this.favoriteOddsByBook;
        this.best_underdog, this.best_favorite, this.best_conversion;

        this.assignUnderdogAndFavorite(gameData.bookmakers[0]);
        this.initOdds(gameData.bookmakers);
    }

    initOdds(bookmakers) {
        this.underdogOddsByBook = Array(bookmakers.length)
        this.favoriteOddsByBook = Array(bookmakers.length)

        for (let i = 0; i < bookmakers.length; i++) {
            let outcomes = bookmakers[i].markets[0].outcomes;

            // Add odds to underdog or favorite array
            for (let j = 0; j < outcomes.length; j++) {
                if (outcomes[j].name === this.underdog) {
                    this.underdogOddsByBook[i] = new OddsEntity(bookmakers[i].title, outcomes[j].price);
                } else {
                    this.favoriteOddsByBook[i] = new OddsEntity(bookmakers[i].title, outcomes[j].price);
                }
            }
        }
        // Sort odds
        this.favoriteOddsByBook.sort((a, b) => (b.odds - a.odds));
        this.underdogOddsByBook.sort((a, b) => (b.odds - a.odds));

        this.best_underdog = this.underdogOddsByBook[0];
        this.best_favorite = this.favoriteOddsByBook[0];
        this.best_conversion = this.calculateConversion(this.best_underdog.odds, this.best_favorite.odds);
    }

    assignUnderdogAndFavorite(bookmaker) {
        let outcome1 = bookmaker.markets[0].outcomes[0];
        let outcome2 = bookmaker.markets[0].outcomes[1];

        if (outcome1.price > 0) {
            this.underdog = outcome1.name;
            this.favorite = outcome2.name;

        } else {
            this.underdog = outcome2.name;
            this.favorite = outcome1.name;
        }
    }

    calculateConversion(underdogOdds, favoriteOdds) {
        const numer = underdogOdds;
        const denom = 1 - (favoriteOdds / 100);
        return numer / denom;
    }

    getPropertiesForJSON() {
        return {
            "local_time": this.local_time, 
            "underdog": this.underdog, 
            "favorite": this.favorite, 
            "best_underdog": this.best_underdog, 
            "best_favorite": this.best_favorite, 
            "best_conversion": this.best_conversion
        };
    }

    printGameInfo() {
        let output =
            `
            Underdog: ${this.underdog} | Favorite: ${this.favorite}
            Gametime: ${this.game_time.toDateString()} | ${this.game_time.toTimeString()}
            Best underdog: ${this.best_underdog.bookmaker} ${this.best_underdog.odds}
            Best favorite: ${this.best_favorite.bookmaker} ${this.best_favorite.odds}
            Best conversion: ${this.best_conversion} \n
            `;

        console.log(output);
    }
}

class OddsEntity {
    constructor(bookmakerTitle, outcome) {
        this.bookmaker = bookmakerTitle
        this.odds = outcome;
    }
}

module.exports = GameInfo;