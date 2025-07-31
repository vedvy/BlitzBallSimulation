import styles from "../page.module.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "../components/context";

export default function PlayerStats()
{
    const dataModel = useContext(DataContext);

    if(!dataModel.loading)
    {
        var playerStats = dataModel.tempPlayerStats;

    }

    return  (
        <div className="game_main_content">
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

                    </tr>
                    {playerStats.map((player, index) => 
                    <tr className={styles.table_rows}>
                        <td className={styles.table_data}>{player.name}</td>
                        <td className={styles.table_data}>{player.HitterStats.Games}</td>
                        <td className={styles.table_data}>{player.HitterStats.PlateAppearences}</td>
                        <td className={styles.table_data}>{player.HitterStats.AtBats}</td>
                        <td className={styles.table_data}>{player.HitterStats.OneB}</td>
                        <td className={styles.table_data}>{player.HitterStats.TwoB}</td>
                        <td className={styles.table_data}>{player.HitterStats.ThreeB}</td>
                        <td className={styles.table_data}>{player.HitterStats.HomeRuns}</td>
                        {/* <td className={styles.table_data}>{player.HitterStats.BB}</td>
                        <td className={styles.table_data}>{player.HitterStats.HitByPitches}</td>
                        <td className={styles.table_data}>{player.HitterStats.RunsBattedIn}</td>
                        <td className={styles.table_data}>{player.HitterStats.Runs}</td>
                        <td className={styles.table_data}>{player.HitterStats.TotalBases}</td>
                        <td className={styles.table_data}>{player.HitterStats.StrikeOuts}</td>
                        <td className={styles.table_data}>{player.HitterStats.AVG}</td>
                        <td className={styles.table_data}>{player.HitterStats.SLGPercent}</td>
                        <td className={styles.table_data}>{player.HitterStats.OBPPercent}</td>
                        <td className={styles.table_data}>{player.HitterStats.OPS}</td>
                        <td className={styles.table_data}>{player.HitterStats.OPSPlus}</td> */}
                    </tr>)}
                    
                </tbody>
                
            </table>
        </div>
    )
}