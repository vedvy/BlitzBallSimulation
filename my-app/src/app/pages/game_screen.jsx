import react from "react";
import styles from "../page.module.css"

export default function GameScreen()
{
    return (
        <div className={styles.game_screen}>
            <div className={styles.banner}>
                <h1>Beta Testing for Game</h1>
            </div>
            <div className="team_banners">
                <div className="team_red">

                </div>
                <div className="team_blue">

                </div>
            </div>
        </div>
    )
}