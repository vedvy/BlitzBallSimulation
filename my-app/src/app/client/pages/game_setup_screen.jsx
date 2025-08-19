'use client'
import styles from "../page.module.css"
import { useState, useContext } from "react";
import axios from "axios";

export default function SetUpScreen()
{
    /*Set Up Screen Works as such:
    0.  Ask the user if they wish to add any new players. These should be in a collection that will then be saved on
    the db. Same for deletion, though that should only be for already added players.
    1. Prompt the user to choose players (Should captains be chosen? Would this make an impact on anything UI-wise?) 
    for each team. Determine the best way to choose for red/blue team.
    3. Ask which team will bat/pitch first
    4. Prompt the user to confirm these choices, showing the choices they made, and if they wish
    to make any additional changes (this can come later). Also make note that once a "real deal" 
    game starts, you'll need to figure out how to account for a early quitout regarding the stats(create a temp collection storing
    the real-time stats updates for players and either discard for early quit or apply to all players if game is completed fully?). 
    Later on, add a button to prompt whether a 4th inning should be played (it sometimes happens.)*/
    const [current_step, set_current_step] = useState("AddDeletePage");
    const [delete_page, update_delete_page] = useState(false);
    
    return(
        <div className={styles.setUpScreenContainer}>
            {current_step === "AddDeletePage" && <div>
               {!delete_page && <div className={styles.addPlayersSection}>
                <h1>Add Players</h1>
                {/*Add the input form here.*/}
            </div>}
            {delete_page && <div className={styles.deletePlayersSection}>
                <h1>Delete Players</h1>
                {/*Show mappings of players with names.*/}
            </div>}
            <button onClick={() => {update_delete_page(!delete_page)}}>{!delete_page ? "Delete Players" : "Add a Player"}</button> 
            </div>}


        </div>
    )
}