'use client'
import styles from "../page.module.css"
import { useState, useContext } from "react";
import axios from "axios";

import { SetUpScreenDataContext } from "../components/setUpScreenContext";

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
    
    const dataModel = useContext(SetUpScreenDataContext);
    if(!dataModel.loading)
    {
        var playersArray = dataModel.players;
    }
    
    const [formData, set_form_data] = useState({
        newPlayer: ""
    })

    const handleChanges = (event) => {
        const {name, value} = event.target;
        console.log(event.target);

        set_form_data({
            ...formData,
            [name]: value
        });
    }

    const confirmNewPlayer = async (event) => 
    {
        event.preventDefault();
        console.log(formData);
        const newPlayerInput = formData.newPlayer.trim();
        console.log(newPlayerInput);
        await axios.post("http://localhost:8000/newPlayer", {newPlayerName: newPlayerInput});
        await dataModel.setUpFetchData();
        return;
    }

    const deletePlayer = async (player) => {
        await axios.post("http://localhost:8000/deletePlayer", {playerToDelete: player});
        await dataModel.setUpFetchData();
        return;
    }
    
    return(
        <div className={styles.setUpScreenContainer}>
            {current_step === "AddDeletePage" && <div>
               {!delete_page && <div className={styles.addPlayersSection}>
                <h1>Add Players Page</h1>
                {/*Add the input form here.*/}
                <br/>
                <h1>Current Players: </h1>
                {dataModel.players.map((player, index) => 
                <h3 key={index} className={styles.addPlayersNames}>{player.name}</h3>)}
                <hr/>
                <h1>Add a new player here: </h1>
                <br/>
                <form onSubmit={confirmNewPlayer}>
                    <textarea 
                    name="newPlayer"
                    placeholder="Enter a new player name here!"
                    value={formData.confirmationText} 
                    onChange={handleChanges}
                    rows={2}>
                    </textarea>
                    <button type="submit" className={styles.quitSubmitButton}>Enter</button>
                </form>
                <br/>
                <br/>
                <button onClick={() => {update_delete_page(!delete_page)}} className={styles.pageButton}>{!delete_page ? "Delete Players" : "Add a Player"}</button>
                
            </div>}
            {delete_page && <div className={styles.deletePlayersSection}>
                <h1>Delete Players Page</h1>
                <br/>
                <h1>Current Players: </h1>
                {dataModel.players.map((player, index) => 
                <h3 key={index} className={styles.deletePlayersNames} onClick={() => {deletePlayer(player);}}>{player.name}</h3>)}
                <button onClick={() => {update_delete_page(!delete_page)}} className={styles.pageButton}>{!delete_page ? "Delete Players" : "Add a Player"}</button>
                {/*Show mappings of players with names.*/}
            
            </div>}
            <br/>
            
             
            </div>}
            
        </div>
    )
}