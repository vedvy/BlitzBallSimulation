const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const tempPlayerStatsSchema = new Schema({
    name: {type: String, required: true},
    HitterStats: {
        Games: {type: Number, default: 0},
        PlateAppearences: {type: Number, default: 0},
        AtBats: {type: Number, default: 0},
        Hits: {type: Number, default: 0},
        OneB: {type: Number, default: 0},
        TwoB: {type: Number, default: 0},
        ThreeB: {type: Number, default: 0},
        HomeRuns: {type: Number, default: 0},
        BB: {type: Number, default: 0},
        HitByPitches: {type: Number, default: 0},
        RunsBattedIn: {type: Number, default: 0},
        Runs: {type: Number, default: 0},
        TotalBases: {type: Number, default: 0},
        StrikeOuts: {type: Number, default: 0},
        AVG: {type: mongoose.Types.Decimal128, default: 1},
        SLGPercent: {type: mongoose.Types.Decimal128, default: 1},
        OBPPercent: {type: mongoose.Types.Decimal128, default: 1},
        OPS: {type: mongoose.Types.Decimal128, default: 1},
        OPSPlus: {type: mongoose.Types.Decimal128, default: 1},
        KPercent: {type: mongoose.Types.Decimal128, default: 1},
        wOBA: {type: mongoose.Types.Decimal128, default: 1},
        wRCPlus: {type: mongoose.Types.Decimal128, default: 1},
        BABIP: {type: mongoose.Types.Decimal128, default: 1},
        ISO: {type: mongoose.Types.Decimal128, default: 1},
        wRCPlus: {type: Number, default: 0}
    },
    PitcherStats: {
        Games: {type: Number, default: 0},
        IP: {type: Number, default: 0}, 
        ERA: {type: mongoose.Types.Decimal128, default: 1},
        FIP: {type: mongoose.Types.Decimal128, default: 1},
        BB: {type: Number, default: 0},
        StrikeOuts: {type: Number, default: 0},
        HitByPitches: {type: Number, default: 0},
        HR: {type: Number, default: 0},
        ER: {type: Number, default: 0},
        HA: {type: Number, default: 0},
        WHIP: {type: Number, default: 0},
        ERAMinus: {type: Number, default: 0},
        FIPMinus: {type: Number, default: 0},
        SV: {type: Number, default: 0},
        BSV: {type: Number, default: 0},
        SVPercent: {type: Number, default: 0},
        KPerNine: {type: mongoose.Types.Decimal128, default: 1},
        FIPMinusRank: {type: Number, default: 0},
        BBPerNine: {type: mongoose.Types.Decimal128, default: 1}
    }
}, {toJSON: {virtuals: true}}, {toObject: {virtuals: true}});

tempPlayerStatsSchema.virtual("OneBUpdate").get(function()
{
    return this.HitterStats.OneB;
}).set(function(v)
{
    let newOneB = this.HitterStats.OneB + 1;
    this.HitterStats.OneB = newOneB;
});

tempPlayerStatsSchema.virtual("TwoBUpdate").set(function()
{
    this.set({TwoB: this.TwoB+1})
});

tempPlayerStatsSchema.virtual("ThreeBUpdate").set(function()
{
    this.set({ThreeB: this.ThreeB+1});
});

tempPlayerStatsSchema.virtual("HRUpdate").set(function()
{
    this.set({HomeRuns: this.HomeRuns+1});
});

/*Calculations can be done easily through virtuals and their respective setters.*/

/*Determine the stats calculations and stuff here. This is where the stat updates will be stored for now.
If the game played from start to end without any forceQuit, then every Player stats should have their stats
updated with these tempPlayerStats stats. 

Put stats calculations and necessary conditionals here! there's a lot of them.*/

/*
Batter Stats: 
---------------------
1B to HR: Based on hitting score.
BB: walk
HBP: add to mainGameInfo field to count twice, Hit By Pitch
>>>> Following below may need tracking who is  on which base.
RBI: Runs Batted In, player hits and runner scores.
Runs: Whoever scores.
Total bases: Single 1, Double 2, Triple 3, HR 4. Walk is 0.
Strikeouts:..
At Bats: (PA - Walks + HBP) . Number of times player comes up to bat. Default is AB, unless it's a walk then PA. Takes in Hit scores and Outs. No bunts or flys.
AVG: Number of hits / Number of AT Bats. 
Plate Appearence: Walk, HBP, or sacrifice fly count towards this.|  
SLG %: Similar to total Bases. (Singles * 1 + Doubles * 2 + Triples * 3 + HR * 4) / AB
OBP %: (Hits + Walks + HBP) / PA
OPS: OBP + SLG%
OPS+: (100 * (OBP% / OBPAVG) + 100 * (SLG% / (SLG%AVG) - 1))
K%: Strikeouts / PA
wOBA: weighted On Base Average. (BB * .69) + (.72 * HBP) + (.89 * 1B) + (1.27 * 2B) + (1.62 * 3B) + (2.1 * HR). 
Then the sum is divided by (AB + BB + HBP)
wRC+: If the PA + Games >= 20, then 100 * (wOBA / wOBAAVG). Otherwise, you unqualified.
BABIP: Batting AVG on Balls in Play. If AB - Strikeouts - HR + 0 > 0, (Hits - HR) / (AB - Strikeouts - HR + 0). Otherwise, N/A.
ISO: (1 * 2B + 2 * 3B + 3 * K3) / AB. IFERROR, then Mark as N/A
wRC+ Rank: Algorithm that determines player rank based on wRC+. Filters through wRC+ based on: ISNUMBER, number > 0, and is a qualified player.
Just a sorting algo for players.

---------------------------------

Pitcher Stats:
Games: Simple.
IP: Innings Pitched. 3 outs in an inning. Outs / 3. If 1/3, .1, 2/3 = .2, 3/3 = Next Whole Int.
ERA: Earned Run Avg. 9*(ER/ IP). If 
FIP: Constant. Fielding Independent Pitching. (13 * HR) + 3 * (Walks + HBP) - 2*(K). All divided by IP + FIP constant (3.72).
If IP <= 0, Mark as N/A.
BB: Walks given up,
K: Strikouts given up
HBP: hits by pitch given up
HR: HR givdn up.
ER: Earned runs. Runs given up essentially.
HA: Hits Allowed? Hits given up
WHIP: (Walks + Hits) / IP. 
ERA-: 100 * (ERA / ERAAVG). If IP <= 0, N/A.
FIP-: Same formula, but with FIP.
SV: Saves. In the 3rd inning, the pitcher that gets the final out gets a save. Ask about this.
BSV: Blown Save. You come in at 9-7 and you let the game tie/lose, then this counts. Irrespective of score.
SV%: SV/(SV + BSV).
K/9: (K*9) / IP
FIP- Rank: Sorting algo for Pitching.
BB/9: (Walks * 9) / IP.


WAR: Ask Sid about how to track this.


What to do now:
0. Track which players are on what plates.
1. Track AB, PA, 1-HR Bs, and Walks, and RBIs. Once you have those, just input the formulas.
2. If you want to see rwal-time stats, write to the logs before the DB. OPS is important in real-time.
*/

module.exports = mongoose.model("TempPlayerStats", tempPlayerStatsSchema);