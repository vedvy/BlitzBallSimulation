import styles from "../page.module.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "../components/context";

export default function PlayerStats()
{
    const dataModel = useContext(DataContext);
    const [statsView, set_stats_view] = useState("Batting");
    console.log(statsView);
    if(!dataModel.loading)
    {
        var playerStats = dataModel.tempPlayerStats;
    }

    return  (
        <div className="game_main_content">
        {statsView === "Batting" &&
        <div>
            <h1 style={{color: "white"}}>Player Stats: {statsView}</h1>
            <br></br>
            <table className={styles.table_stats}>
                <tbody>
                    <tr className={styles.table_rows}>
                        <th className={styles.table_header}>Player</th>
                        <th className={styles.table_header}>Games</th>
                        <th className={styles.table_header}>PA</th>
                        <th className={styles.table_header}>At Bats</th>
                        <th className={styles.table_header}>1B</th>
                        <th className={styles.table_header}>2B</th>
                        <th className={styles.table_header}>3B</th>
                        <th className={styles.table_header}>HR</th>
                        <th className={styles.table_header}>BB</th>
                        <th className={styles.table_header}>HBP</th>
                        <th className={styles.table_header}>RBI</th>
                        <th className={styles.table_header}>Runs</th>
                        <th className={styles.table_header}>Total Bases</th>
                        <th className={styles.table_header}>K</th>
                        <th className={styles.table_header}>AVG</th>
                        <th className={styles.table_header}>SLG%</th>
                        <th className={styles.table_header}>OBP%</th>
                        <th className={styles.table_header}>OPS</th>
                        <th className={styles.table_header}>OPS+</th>
                        <th className={styles.table_header}>K%</th>
                        <th className={styles.table_header}>wOBA</th>
                        <th className={styles.table_header}>wRC+</th>
                        <th className={styles.table_header}>BABIP</th>
                        <th className={styles.table_header}>ISO</th>
                        <th className={styles.table_header}>wRCPlus Rank</th>

                    </tr>
                    {playerStats.map((player, index) => 
                    <tr className={styles.table_rows} key={index}>
                        <td className={styles.table_data}>{player.name}</td>
                        <td className={styles.table_data}>{player.HitterStats.Games}</td>
                        <td className={styles.table_data}>{player.HitterStats.PlateAppearences}</td>
                        <td className={styles.table_data}>{player.HitterStats.AtBats}</td>
                        <td className={styles.table_data}>{player.HitterStats.OneB}</td>
                        <td className={styles.table_data}>{player.HitterStats.TwoB}</td>
                        <td className={styles.table_data}>{player.HitterStats.ThreeB}</td>
                        <td className={styles.table_data}>{player.HitterStats.HomeRuns}</td>
                        <td className={styles.table_data}>{player.HitterStats.Walks}</td>
                        <td className={styles.table_data}>{player.HitterStats.HitByPitches}</td>
                        <td className={styles.table_data}>{player.HitterStats.RunsBattedIn}</td>
                        <td className={styles.table_data}>{player.HitterStats.Runs}</td>
                        <td className={styles.table_data}>{player.HitterStats.TotalBases}</td>
                        <td className={styles.table_data}>{player.HitterStats.StrikeOuts}</td>
                        <td className={styles.table_data}>{player.HitterStats.Average.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.HitterStats.SLGPercent.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.HitterStats.OBPPercent === null ? "N/A" : player.HitterStats.OBPPercent.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.HitterStats.OnBasePlusSlugging === null ? "N/A" : player.HitterStats.OnBasePlusSlugging.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.HitterStats.OPSPlus === null ? "N/A" : player.HitterStats.OPSPlus.toFixed(0)}</td>
                        <td className={styles.table_data}>{player.HitterStats.KPercent === null ? "N/A" : player.HitterStats.KPercent.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.HitterStats.wOBA === null ? "N/A" : player.HitterStats.wOBA.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.HitterStats.wRCPlus === null ? "N/A" : player.HitterStats.wRCPlus.toFixed(0)}</td>
                        <td className={styles.table_data}>{player.HitterStats.BatAvgBallsInPlay === null ? "N/A" : player.HitterStats.BatAvgBallsInPlay.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.HitterStats.IsolatedPower === null ? "N/A" : player.HitterStats.IsolatedPower.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.HitterStats.wRCPlusRank}</td>
                    </tr>)}
                    
                </tbody>
                
            </table>
        </div>}
        {statsView === "Pitching" && 
        <div>
            <h1 style={{color: "white"}}>Player Stats: {statsView}</h1>
            <br></br>
            <table className={styles.table_stats}>
                <tbody>
                    <tr className={styles.table_rows}>
                        <th className={styles.table_header}>Player</th>
                        <th className={styles.table_header}>Games</th>
                        <th className={styles.table_header}>Innings Pitched</th>
                        <th className={styles.table_header}>ERA</th>
                        <th className={styles.table_header}>FIP</th>
                        <th className={styles.table_header}>BB</th>
                        <th className={styles.table_header}>Outs</th>
                        <th className={styles.table_header}>K</th>
                        <th className={styles.table_header}>HBP</th>
                        <th className={styles.table_header}>HR</th>
                        <th className={styles.table_header}>ER</th>
                        <th className={styles.table_header}>HA</th>
                        <th className={styles.table_header}>WHIP</th>
                        <th className={styles.table_header}>ERA-</th>
                        <th className={styles.table_header}>FIP-</th>
                        <th className={styles.table_header}>SV</th>
                        <th className={styles.table_header}>BSV</th>
                        <th className={styles.table_header}>SV%</th>
                        <th className={styles.table_header}>K/9</th>
                        <th className={styles.table_header}>FIP- Rank</th>
                        <th className={styles.table_header}>BB/9</th>

                    </tr>
                    {playerStats.map((player, index) => 
                    <tr className={styles.table_rows} key={index}>
                        <td className={styles.table_data}>{player.name}</td>
                        <td className={styles.table_data}>{player.PitcherStats.Games}</td>
                        <td className={styles.table_data}>{player.PitcherStats.InningsPitched}</td>
                        <td className={styles.table_data}>{player.PitcherStats.EarnedRunAverage === null ? "N/A" : player.PitcherStats.EarnedRunAverage.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.PitcherStats.FieldingIndPitching === null ? "N/A" : player.PitcherStats.FieldingIndPitching.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.PitcherStats.Walks}</td>
                        <td className={styles.table_data}>{player.PitcherStats.Outs}</td>
                        <td className={styles.table_data}>{player.PitcherStats.StrikeOuts}</td>
                        <td className={styles.table_data}>{player.PitcherStats.HitByPitches}</td>
                        <td className={styles.table_data}>{player.PitcherStats.HomeRuns}</td>
                        <td className={styles.table_data}>{player.PitcherStats.EarnedRuns}</td>
                        <td className={styles.table_data}>{player.PitcherStats.HitsAllowed}</td>
                        <td className={styles.table_data}>{player.PitcherStats.WalksHitsInningsPitched === null ? "N/A" : player.PitcherStats.WalksHitsInningsPitched.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.PitcherStats.ERAMinus}</td>
                        <td className={styles.table_data}>{player.PitcherStats.FIPMinus}</td>
                        <td className={styles.table_data}>{player.PitcherStats.Save}</td>
                        <td className={styles.table_data}>{player.PitcherStats.BlownSave}</td>
                        <td className={styles.table_data}>{player.PitcherStats.SVPercent}</td>
                        <td className={styles.table_data}>{player.PitcherStats.KPerNine === null ? "N/A" : player.PitcherStats.KPerNine.toFixed(2)}</td>
                        <td className={styles.table_data}>{player.PitcherStats.FIPMinusRank}</td>
                        <td className={styles.table_data}>{player.PitcherStats.BBPerNine === null ? "N/A" : player.PitcherStats.BBPerNine.toFixed(2)}</td>
                        
                    </tr>)}
                    
                </tbody>
                
            </table>
        </div>}

            <button className={styles.switchStatsViewButton} onClick={() => {statsView === "Batting" ? set_stats_view("Pitching") : set_stats_view("Batting");}}>Switch Stats View</button>
        </div>
    )
}