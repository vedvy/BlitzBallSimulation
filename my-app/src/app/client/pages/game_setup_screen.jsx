'use client'
import styles from "../page.module.css"
import { useState, useContext , useEffect, useRef} from "react";
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
    const [position_choices, set_position_choices] = useState({
        pitching: "",
        hitting: ""
    });

    const [delete_players_page, update_delete_players_page] = useState(false);
    const [delete_details, update_delete_info] = useState({
        confirmDelete: false,
        player: ""
    });

    const dataModel = useContext(SetUpScreenDataContext);
    if(!dataModel.loading)
    {
        var playersArray = dataModel.players;
        console.log(mutatablePlayersArray);
        var current_page = dataModel.current_page;
        console.log(current_page);
    }

    var mutatablePlayersArray = [];
    const [mutPlayersArray, update_mutPA] = useState(mutatablePlayersArray);

    var loadedOnce = useRef(false);

    const fetchData = async () => {
        if(!loadedOnce.current)
        {
            loadedOnce.current = true;
            playersArray.map((players, index) => mutatablePlayersArray.push(players.name));
            update_mutPA(mutatablePlayersArray);
        }
        
    }

    useEffect(() => {
        fetchData();
    }, [])
    
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
        if(current_step === "AddDeletePage")
        {
            set_current_step("AssignTeams");
        }
    }

    function removePlayerFromTeam(player, team, update_function) 
    {
        console.log(team);
        console.log(player);
        team = team.filter(teamPlayer => !teamPlayer.includes(player));
        let newMutPA = mutPlayersArray;
        console.log(mutPlayersArray);
        newMutPA.push(player);
        update_mutPA(newMutPA);
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

    function choosePosition(firstPosition, teamChosen, otherTeam)
    {
       firstPosition === "Pitching" ? set_position_choices({pitching: teamChosen, hitting: otherTeam}) : set_position_choices({pitching: otherTeam, hitting: teamChosen});
        console.log("Position Choices: Pitching: ", position_choices.pitching, " Hitting: ", position_choices.hitting);
    }

    const confirmAllChoices = async () => {
        if(red_team_lineup.length < 1 || blue_team_lineup < 1)
        {
            alert("Each team must have at least one player in their lineups!");
            return;
        }
        if(!position_choices.pitching.trim() || !position_choices.hitting.trim())
        {
            alert("Choose a position for each team to start with before starting the game!");
            return;
        }
        console.log("Position Choices before the new game creation: Pitching: ", position_choices.pitching, " Hitting: ", position_choices.hitting);
        await axios.post("http://localhost:8000/createNewGame", {red_team_lineup: red_team_lineup, blue_team_lineup: blue_team_lineup,
            position_choices: position_choices
        });
 
        alert("Database updated. Switch providers to GameScreen to play game!");
        //set up backend stuff and figure out how to switch screens for games from here.
    }

    console.log(delete_details.confirmDelete);
    return(
        <div className={styles.setUpScreenContainer}>
            {current_step === "AddDeletePage" && <div className={styles.addDeleteContainer}>
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
            {current_step === "AssignTeams" && 
            <div className={styles.assignTeamsContainer}>
                <h2>Select the Players For Your Teams</h2>
                <div className={styles.assignTeamsHeader}>
                    {mutPlayersArray.map((player, index) => 
                    <span key={index} className={choose_red_team ? styles.assignTeamNamesRed : styles.assignTeamNamesBlue}
                    onClick={choose_red_team ? () => {addPlayerToTeam(player, red_team_lineup, update_red_team_lineup);} : () => {addPlayerToTeam(player, blue_team_lineup, update_blue_team_lineup);}}>
                        {player}</span>)}
                    <br/>
                    <br/>
                    <button onClick={() =>{set_choose_red_team(true);}} className={choose_red_team ? styles.inactiveButton : styles.player_buttons_red}>Choose for Red Team</button>
                    <button onClick={() => {set_choose_red_team(false);}} className={choose_red_team ? styles.player_buttons_blue : styles.inactiveButton}>Choose for Blue Team</button>
                    <br/>
                </div>
                <div className={styles.assignTeamRedHeader}>
                   <h1>Red Team: </h1> 
                   <button className={position_choices.pitching === "red" ? styles.inactiveButton : styles.assignTeamNamesRed} onClick={() => {choosePosition("Pitching", "red", "blue")}}>Pitching</button>
                   <button className={position_choices.hitting === "red" ? styles.inactiveButton : styles.assignTeamNamesRed} onClick={() => {choosePosition("Hitting", "red", "blue")}}>Hitting</button>
                   <br/>
                   <br/>
                   {red_team_lineup.map((player, index) => 
                <span key={index} className={styles.deletePlayersNames} style={{fontSize:"20px"}} onClick={() => {removePlayerFromTeam(player, red_team_lineup, update_red_team_lineup);}}>{player}</span>)}
                </div>
                <div className={styles.assignTeamBlueHeader}>
                    <h1>Blue Team:  </h1>
                    <button className={position_choices.pitching === "blue" ? styles.inactiveButton : styles.assignTeamNamesBlue} onClick={() => {choosePosition("Pitching", "blue", "red")}}>Pitching</button>
                    <button className={position_choices.hitting === "blue" ? styles.inactiveButton : styles.assignTeamNamesBlue} onClick={() => {choosePosition("Hitting", "blue", "red")}}>Hitting</button>
                    <br/>
                    <br/>
                    {blue_team_lineup.map((player, index) => 
                <span key={index} className={styles.deletePlayersNames} style={{fontSize:"20px"}} onClick={() => {removePlayerFromTeam(player, blue_team_lineup, update_blue_team_lineup);}}>{player}</span>)}
                </div>
                <br/>
            <button onClick={async () => {await confirmAllChoices();}}>Click here once you are absolutely ready to start the game. Properly confirm your lineups and positions</button>
            </div>}
            {current_page === "AddDeletePage" && <button onClick={async () => {await nextPage();}}>NEXT PAGE</button>}
            
        </div>
    )
}