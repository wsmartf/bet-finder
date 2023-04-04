
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const sportsRouter = require("./routes/sports");
const oddsRouter = require("./routes/odds");

app.use("/sports", sportsRouter);
app.use("/odds", oddsRouter);

app.get('/', (req, res) => res.json({title: "BetFinder API"}));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));