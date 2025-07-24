import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "../components/context";
import styles from "../page.module.css"


export default function SelectPlayer()
{
    const [redPlayerChosen, set_red_player] = useState();
    const [bluePlayerChosen, set_blue_player] = useState();
    // const [redTeamPlayers, set_RTP] = useState();
    // const [blueTeamPlayers, set_BTP] = useState();

    const dataModel = useContext(DataContext);
    if(!dataModel.loading)
    {
        var teamRed = dataModel.teams[0];
        var teamBlue = dataModel.teams[1];
        var redTeamPlayers = dataModel.redTeamPlayers;

        var blueTeamPlayers = dataModel.blueTeamPlayers;


    }
      

    const chosenRedPlayer = async (player) => {
        console.log("Inside chosenRedPlayer");
        

        if(bluePlayerChosen)
        {
            
            await axios.post("http://localhost:8000/setNextPlayers", {redPlayerChosen: player,
                bluePlayerChosen: bluePlayerChosen, teamRed: teamRed, teamBlue: teamBlue
            });

            dataModel.view = "gameField";
            console.log(dataModel.view);
            await dataModel.fetchData();
            //server call and then switch view back to game field.
            
        }
        else
        {
            set_red_player(player);
        }
        
    }

    const chosenBluePlayer = async (player) => {
        if(redPlayerChosen)
        {
            await axios.post("http://localhost:8000/setNextPlayers", {redPlayerChosen: redPlayerChosen,
                bluePlayerChosen: player, teamRed: teamRed, teamBlue: teamBlue
            });

            dataModel.view = "gameField";
            console.log(dataModel.view);
            await dataModel.fetchData();
        }
        else
        {
            set_blue_player(player);
        }
    }

    


    /*Think about how to implement this server-side. User should: 
    1. Be prompted the choices with  the names, not the ids.
    2. Click and confirm them EACH. Lock in for one and other before making the decision. The choices
    must be either separate or together. 
    3. Do the server-side changes with the corresponding ids. 
    4. Do a re-render before going back to the game. 
    NOTE: maintain the state of this page in case of dropped connections/add it to the dataModel as a
    toggle-view choice.
    FINALLY: Allow the names to be visible in the game_screen. Once this is completed, the game log
    should be worked on, then the results screen, then the game creation screen. Then Beta will be
    done and we work higher from there on the Season creation screen. But before that, do a live-hosting
    check.*/


    return (
        <div className="game_main_content">
            {!redPlayerChosen && <div className={styles.selectPlayerRed}>
                {teamRed.teamChoices === "hitter" ? <h1>Choose Red Team's Hitter</h1> : <h1>Choose Red Team's Pitcher</h1>}
                
                {redTeamPlayers.map((player, index) => 
                        <button key={index} className={styles.select_player_red}
                        onClick={async () => {await chosenRedPlayer(player);}}>{player}</button>
                )}    
            </div>}
            {redPlayerChosen && <div className={styles.playerRedChosen}>
                    <h1>Red Player Up Next: {redPlayerChosen}</h1>
                </div>}
            {!bluePlayerChosen && <div className={styles.selectPlayerBlue}>
                {teamBlue.teamChoices === "hitter" ? <h1>Choose Blue Team's Hitter</h1> : <h1>Choose Blue Team's Pitcher</h1>}
                {blueTeamPlayers.map((player, index) => 
                    <button key={index} className={styles.select_player_blue}
                    onClick={async () => {await chosenBluePlayer(player);}}>
                        {player}
                    </button>
                )}
            </div>}
            {bluePlayerChosen && 
            <div className={styles.playerBlueChosen}>
                <h1>Blue Player Up Next: {bluePlayerChosen}</h1>
            </div>}
        </div>
    )
}