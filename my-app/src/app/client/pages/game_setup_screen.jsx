'use client'
import styles from "../page.module.css"
import { useState, useContext } from "react";
import axios from "axios";

import { SetUpScreenDataContext } from "../components/setUpScreenContext";
import player from "@/app/server/models/player";

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
    const [choose_red_team, set_choose_red_team] = useState(true);

    const [red_team_lineup, update_red_team_lineup] = useState([]);
    const [blue_team_lineup, update_blue_team_lineup] = useState([]);
    

    const [delete_players_page, update_delete_players_page] = useState(false);
    const [delete_details, update_delete_info] = useState({
        confirmDelete: false,
        player: ""
    });

    const dataModel = useContext(SetUpScreenDataContext);
    if(!dataModel.loading)
    {
        var playersArray = dataModel.players;
        var mutatablePlayersArray = [];
        playersArray.map((players, index) => mutatablePlayersArray.push(players.name));
        console.log(mutatablePlayersArray);
        var current_page = dataModel.current_page;
        console.log(current_page);
    }

    const [mutPlayersArray, update_mutPA] = useState(mutatablePlayersArray);
    
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
        await dataModel.setUpFetchData("AddDeletePage");
        return;
    }

    const deletePlayer = async (player) => {
        await axios.post("http://localhost:8000/deletePlayer", {playerToDelete: player});
        await dataModel.setUpFetchData("AddDeletePage");
        return;
    }
    
    const nextPage = async () => {
        if(current_page === "AddDeletePage")
        {
            await dataModel.setUpFetchData("AssignTeams");
        }
    }

    function removePlayerFromTeam(player, team, update_function) 
    {
        console.log(team);
        console.log(player);
        team = team.filter(teamPlayer => !teamPlayer.includes(player));
        mutatablePlayersArray.push(player);
        update_mutPA(mutatablePlayersArray);
        console.log(team);
        update_function(team);
        return team;
    }

    function addPlayerToTeam(player, team, update_function)
    {
        let currentLineup = team;
        currentLineup.push(player);
        update_function(currentLineup);
        let newMutPA = mutPlayersArray;
        console.log(mutPlayersArray);
        newMutPA = newMutPA.filter(playerMember => !playerMember.includes(player));
        update_mutPA(newMutPA);
        console.log(mutPlayersArray);
        return currentLineup;
    }


    console.log(delete_details.confirmDelete);
    return(
        <div className={styles.setUpScreenContainer}>
            {current_page === "AddDeletePage" && <div className={styles.addDeleteContainer}>
               {!delete_players_page && <div className={styles.addPlayersSection}>
                <h1>Add Players Page</h1>
                {/*Add the input form here.*/}
                <br/>
                <h1>Current Players: </h1>
                {dataModel.players.length && dataModel.players.map((player, index) => 
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
                <button onClick={() => {update_delete_players_page(!delete_players_page)}} className={styles.pageButton}>{!delete_players_page ? "Delete Players" : "Add a Player"}</button>
                
            </div>}
            {delete_players_page && <div className={styles.deletePlayersSection}>
                <h1>Delete Players Page</h1>
                <br/>
                <h1>Current Players: </h1>
                {dataModel.players.length && dataModel.players.map((player, index) => 
                <h3 key={index} className={styles.deletePlayersNames} onClick={() => {update_delete_info({confirmDelete: true, player: player});}}>{player.name}</h3>)}
                <button onClick={() => {update_delete_players_page(!delete_players_page)}} className={styles.pageButton}>{!delete_players_page ? "Delete Players" : "Add a Player"}</button>
                {/*Show mappings of players with names.*/}
                {delete_details.confirmDelete && 
                <div>
                    <br/>
                    <br/>
                    <h3>All statistics and data associated with {delete_details.player.name} will be deleted and gone forever.
                    Are you sure you still want to delete this player?</h3>
                    <br/>
                    <button className={styles.quitSubmitButton} onClick={async () => {update_delete_info({confirmDelete: false, player: ""}); await deletePlayer(delete_details.player);}}>Yes, delete this player right now!</button>
                    <button className={styles.quitCancelButton} onClick={async () => {update_delete_info({confirmDelete: false, player: ""});}}>No thanks.</button>
                </div>
                }
            </div>}
            <br/>
            
             
            </div>}
            {current_page === "AssignTeams" && 
            <div className={styles.assignTeamsContainer}>
                <div className={styles.assignTeamsHeader}>
                    {mutPlayersArray.length && mutPlayersArray.map((player, index) => 
                    <span key={index} className={choose_red_team ? styles.assignTeamNamesRed : styles.assignTeamNamesBlue}
                    onClick={choose_red_team ? () => {addPlayerToTeam(player, red_team_lineup, update_red_team_lineup);} : () => {addPlayerToTeam(player, blue_team_lineup, update_blue_team_lineup);}}>
                        {player}</span>)}
                    <br/>
                    <br/>
                    <button onClick={() =>{set_choose_red_team(true);}} className={choose_red_team ? styles.inactiveButton : styles.player_buttons_red}>Choose for Red Team</button>
                    <button onClick={() => {set_choose_red_team(false);}} className={choose_red_team ? styles.player_buttons_blue : styles.inactiveButton}>Choose for Blue Team</button>
                </div>
                <div>
                   <br/>
                   <h1>Red Team: </h1> 
                   {red_team_lineup.length && red_team_lineup.map((player, index) => 
                <span key={index} className={styles.deletePlayersNames} onClick={() => {removePlayerFromTeam(player, red_team_lineup, update_red_team_lineup);}}>{player}</span>)}
                </div>
                <div>
                    <h1>Blue Team:  </h1>
                    {blue_team_lineup.length && blue_team_lineup.map((player, index) => 
                <span key={index} className={styles.deletePlayersNames} onClick={() => {removePlayerFromTeam(player, blue_team_lineup, update_blue_team_lineup);}}>{player}</span>)}
                </div>
            </div>}
            <button onClick={async () => {await nextPage();}}>NEXT PAGE</button>
        </div>
    )
}