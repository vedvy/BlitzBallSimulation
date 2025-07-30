const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const tempPlayerStatsSchema = new Schema({
    name: {type: String, required: true},
    HitterStats: {
        Games: Number,
        PlateAppearences: Number,
        AtBats: Number,
        Hits: Number,
        OneB: Number,
        TwoB: Number,
        ThreeB: Number,
        HomeRuns: Number,
        BB: Number,
        HitByPitches: Number,
        RunsBattedIn: Number,
        Runs: Number,
        TotalBases: Number,
        StrikeOuts: Number,
        AVG: mongoose.Types.Decimal128,
        SLGPercent: mongoose.Types.Decimal128,
        OBPPercent: mongoose.Types.Decimal128,
        OPS: mongoose.Types.Decimal128,
        OPSPlus: mongoose.Types.Decimal128,
        KPercent: mongoose.Types.Decimal128,
        wOBA: mongoose.Types.Decimal128,
        wRCPlus: mongoose.Types.Decimal128,
        BABIP: mongoose.Types.Decimal128,
        ISO: mongoose.Types.Decimal128,
        wRCPlus: Number
    },
    PitcherStats: {
        Games: Number,
        IP: Number, 
        ERA: mongoose.Types.Decimal128,
        FIP: mongoose.Types.Decimal128,
        BB: Number,
        StrikeOuts: Number,
        HitByPitches: Number,
        HR: Number,
        ER: Number,
        HA: Number,
        WHIP: Number,
        ERAMinus: Number,
        FIPMinus: Number,
        SV: Number,
        BSV: Number,
        SVPercent: Number,
        KPerNine: mongoose.Types.Decimal128,
        FIPMinusRank: Number,
        BBPerNine: mongoose.Types.Decimal128
    }
});

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
OPS: OBP + SLG
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
