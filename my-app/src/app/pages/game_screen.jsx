import react from "react";
import styles from "../page.module.css"

export default function GameScreen()
{
    return (
        <div className={styles.game_screen}>
            <div className={styles.banner}>
                <h1>Beta Testing for Game</h1>
            </div>
            <div className={styles.team_banners}>
                <div className={styles.team_red_banner}>
                    <h1 style={{textAlign: "center"}}>Team Red | Score: 0</h1>
                    <hr/>
                    <h2>Current Batter: _______</h2>
                    <h2>Current Pitcher: _______</h2>
                    <hr/>
                    <h3 style={{textAlign: "center"}}>Current Actions: </h3>
                    <span className={styles.player_buttons_red}>Button 1</span>

                </div>
                <div className={styles.team_blue_banner}>
                    <h1 style={{textAlign: "center"}}>Team Blue | Score: 0</h1>
                    <hr/>
                    <h2>Current Batter: _______</h2>
                    <h2>Current Pitcher: _______</h2>
                    <hr/>
                    <h3 style={{textAlign: "center"}}>Current Actions: </h3>
                    <span className={styles.player_buttons_blue}>Button 1</span>
 
                </div>
            </div>
            <div className={styles.game_main_content}>
                <div className={styles.game_field}>
                    <span>Strikes: </span>
                    <span>Balls: </span>
                </div>
                <div className={styles.logger_section}>
                    <h2>Logger area</h2>
                </div>
            </div>
        </div>
    )
}