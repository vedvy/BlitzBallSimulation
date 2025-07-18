import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "../components/context";


export default function selectPlayer()
{
    const dataModel = useContext(DataContext);
    if(!dataModel.loading)
    {
        var teamRed = dataModel.teams[0];
        var teamBlue = dataModel.teams[1];
        
    }

    /*Think about how to implement this server-side. User should: 
    1. Be prompted the choices with  the names, not the ids.
    2. Click and confirm them EACH. Lock in for one and other before making the decision.
    3. Do the server-side changes with the corresponding ids. 
    4. Do a re-render before going back to the game. 
    NOTE: maintain the state of this page in case of dropped connections/add it to the dataModel as a
    toggle-view choice.
    FINALLY: Allow the names to be visible in the game_screen. Once this is completed, the game log
    should be worked on, then the results screen, then the game creation screen. Then Beta will be
    done and we work higher from there on the Season creation screen. But before that, do a live-hosting
    check.*/


    return (
        <div className="selectPlayerContainer">
            <div className="selectPlayerRed">
                {teamRed.teamChoices === "hitter" ? <h1>Choose Red Team's Hitter</h1> : <h1>Choose Red Team's Pitcher</h1>}
                {teamRed.teamPlayers.map((player) => {
                    <button className="player_buttons_red">
                        {player}
                    </button>
                })}    
            </div>
            <div className="selectPlayerBlue">
                {teamBlue.teamChoices === "hitter" ? <h1>Choose Blue Team's Hitter</h1> : <h1>Choose Blue Team's Pitcher</h1>}
                {teamBlue.teamPlayers.map((player) => {
                    <button className="player_buttons_blue">
                        {player}
                    </button>
                })}
            </div>
        </div>
    )
}