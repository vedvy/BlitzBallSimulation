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
        Walks: {type: Number, default: 0},
        HitByPitches: {type: Number, default: 0},
        RunsBattedIn: {type: Number, default: 0},
        Runs: {type: Number, default: 0},
        TotalBases: {type: Number, default: 0},
        StrikeOuts: {type: Number, default: 0},
        Average: {type: Number, default: 1.00},
        SLGPercent: {type: Number, default: 1.00},
        OBPPercent: {type: Number, default: 1.00},
        OnBasePlusSlugging: {type: Number, default: 1.00},
        OPSPlus: {type: Number, default: 1.00},
        KPercent: {type: Number, default: 1.00},
        wOBA: {type: Number, default: 1.00},
        wRCPlus: {type: Number, default: 1.00},
        BatAvgBallsInPlay: {type: Number, default: 1.00},
        IsolatedPower: {type: Number, default: 1.00},
        wRCPlusRank: {type: Number, default: 0}
    },
    PitcherStats: {
        Games: {type: Number, default: 0},
        InningsPitched: {type: Number, default: 0}, 
        EarnedRunAverage: {type: Number, default: 1.00},
        FieldingIndPitching: {type: Number, default: 1.00},
        Walks: {type: Number, default: 0},
        StrikeOuts: {type: Number, default: 0},
        HitByPitches: {type: Number, default: 0},
        HomeRuns: {type: Number, default: 0},
        EarnedRuns: {type: Number, default: 0},
        HitsAllowed: {type: Number, default: 0},
        WalksHitsInningsPitched: {type: Number, default: 0},
        ERAMinus: {type: Number, default: 0},
        FIPMinus: {type: Number, default: 0},
        Save: {type: Number, default: 0},
        BlownSave: {type: Number, default: 0},
        SVPercent: {type: Number, default: 0},
        KPerNine: {type: Number, default: 1.00},
        FIPMinusRank: {type: Number, default: 0},
        BBPerNine: {type: Number, default: 1.00}
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
Games: Should be incremented only once for every player in the mainGameInfo only.
1B to HR: Based on hitting score. DONE
BB: walk. DONE
HBP: add to mainGameInfo field to count twice, Hit By Pitch. DONE
>>>> Following below may need tracking who is  on which base.
RBI: Runs Batted In, player hits and runner scores. Just update with the number of runs scored on their turn.
Runs: Whoever scores. increments based on whether player gets to Home Plate within the inning.
Total bases: Single 1, Double 2, Triple 3, HR 4. Walk is 0. (1 * 1B + 2 * 2B + 3 * 3B + 4 * HR)
Strikeouts:.. DONE
At Bats: Only includes Outs, Hits, Strikeouts. Number of times player comes up to bat. Default is AB, unless it's a walk then PA. Takes in Hit scores and Outs. No bunts or flys.
^^^DONE?
 
Plate Appearence: Increments for every time a player steps into the box.
^^^DONE?

----------The rest of these require the League Averages to be calculated or another variable to be calculated before
its own. What I'm saying is: Keep these stat updates until last, use the end game values calculate all of them and
then update the fields while the game over screen appears.
AVG: Number of hits / Number of AT Bats.
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