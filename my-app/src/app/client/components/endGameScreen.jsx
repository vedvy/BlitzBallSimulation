import styles from "../page.module.css"
import axios from "axios";

export default function EndGameScreen(
    {teamRed, teamBlue, mainGameInfo}
)

{
    console.log(teamRed.teamScore);



    return (
        <div className={styles.game_main_content}>
            <div className={styles.winnerScreen}>
                <span className={styles.winnerTitle}>Winner: </span>
                    {teamRed.teamScore > teamBlue.teamScore && <div>
                    <span className={styles.winnerTitle} style={{color: "coral"}}>Team Red</span>
                </div>}
            {teamRed.teamScore < teamBlue.teamScore && <div>
                <span className={styles.winnerTitle} style={{color: "lightblue"}}>Team Blue</span>
                </div>}
            {teamRed.teamScore === teamBlue.teamScore && <div>
                <span className={styles.winnerTitle} style={{color: "orange"}}>It's a Tie!</span>
                </div>}
            <h1>Team Red Score: {teamRed.teamScore}</h1>
            <h1>Team Blue Score: {teamBlue.teamScore}</h1>
            </div>
            
            <div className={styles.logger_section}>
                <h2 style={{textAlign: "center"}}>Game Logs</h2>
                <div className={styles.logger_content} id="game_log">
                    {mainGameInfo.logMessages.map((log, index) => 
                        <p key={index} className={styles.logMessages}>{log}</p>
                    )}
                </div>
            </div>
        </div>
    )
}