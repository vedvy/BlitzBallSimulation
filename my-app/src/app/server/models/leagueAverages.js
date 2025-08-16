const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const leagueAverages = new Schema({
    HitterStats: {
        OneB: {type: Number, default: 0},
        TwoB: {type: Number, default: 0},
        ThreeB: {type: Number, default: 0},
        HomeRuns: {type: Number, default: 0},
        Walks: {type: Number, default: 0},
        HitByPitches: {type: Number, default: 0},
        AtBats: {type: Number, default: 0},
        PlateAppearences: {type: Number, default: 0},
        Hits: {type: Number, default: 0},
        SLGPercent: {type: Number, default: 0},
        OBPPercent: {type: Number, default: 0},
        wOBA: {type: Number, default: 0},
    }
    ,
    PitcherStats: {
        StrikeOuts: {type: Number, default: 0},
        InningsPitched: {type: Number, default: 0},
        EarnedRunAverage: {type: Number, default: 0},
        EarnedRuns: {type: Number, default: 0},
        HomeRuns: {type: Number, default: 0},
        Walks: {type: Number, default: 0},
        HitByPitches: {type: Number, default: 0},
        FIPAvg: {type: Number, default: 0}

    }
}, {toJSON: {virtuals: true}}, {toObject: {virtuals: true}});


module.exports = mongoose.model("LeagueAverages", leagueAverages);
/*
Batting Stats:

SLG% Total/AVG: TotalBases Sum / AtBats Sum
OBP%: (Hits Sum + HBP Sum + BB Sum) / PA Sum
wOBA: (0.69 * BB Sum) + (0.72 * HBP) + (0.89 * 1B Sum) + (1.27 * 2B Sum) + (1.62 * 3B Sum) + (2.1 * HR Sum) all divided 
by (BB Sum + ATBATs sums + HBP Sum).

Pitching Stats:

ERA-: (100 * player's ERA)/ ERA Avg.
ERA Avg: (ER Sum / IP Sum) * 9

FIP Avg: (((13 * HR Sum) + (3 * (BB Sum + HBP Sum)) - (2 * K Sum)) / IP Sum) + 3.72


*/