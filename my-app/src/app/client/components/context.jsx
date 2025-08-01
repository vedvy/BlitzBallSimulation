'use client'

import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({children}) => {
    const [players, set_players] = useState([]);
    const [redTeamPlayers, set_red_team_players] = useState([]);
    const [blueTeamPlayers, set_blue_team_players] = useState([]);
    const [teams, set_teams] = useState([]);
    const [main_game_info, set_main_game_info] = useState([]);
    const [tempPlayerStats, set_temp_player_stats] = useState([]);
    const [view, toggle_view] = useState("gameField");
    //Views: selectPlayer, gameField for now.
    const [loading, set_loading] = useState(true);
    
    /*Add a view toggle state here!*/

    const fetchData = async(viewChoice) =>
    {

        set_loading(true);
        console.log("Loading: ",loading);
        console.log("Obtaining Players");
        console.log(viewChoice);
        const playerResponse = await axios.get("http://localhost:8000/players");

        set_players(playerResponse.data);

        const teamResponse = await axios.get("http://localhost:8000/teams");
        set_teams(teamResponse.data);

        const mainGameResponse = await axios.get("http://localhost:8000/maingame");
        set_main_game_info(mainGameResponse.data.mainGame);
       
        const playerNamesResponse = await axios.get("http://localhost:8000/teamplayernames");
        set_red_team_players(playerNamesResponse.data.redTeamPlayers);
        set_blue_team_players(playerNamesResponse.data.blueTeamPlayers);

        const tempPlayerResponse = await axios.get("http://localhost:8000/tempPlayerStats");
        set_temp_player_stats(tempPlayerResponse.data);

        // if(view === "selectPlayer")
        // {
        //     toggle_view("gameField");
        // }
        // else
        // {
        //     toggle_view("selectPlayer");
        // }
        if(mainGameResponse.data.gameOver === true){
            switchViews("gameOver");
        }
        else if(viewChoice)
        {
            switchViews(viewChoice);
        }
        else
        {
            switchViews("selectPlayer");
        }
        
        set_loading(false);
        console.log("Loading: ", loading);
    }

    const switchViews = (viewChoice) => {
        toggle_view(viewChoice);
    }

    useEffect(() => {
     fetchData();
     console.log(players);
    }, []);

    // const fetchTeamPlayers = async (players, teams) => {
    //     let teamRed = teams[0];
    //     let teamBlue = teams[1];
    //     await axios.post("http://localhost:8000/teamplayernames", {playersArray: players, teamRed: teamRed,
    //         teamBlue: teamBlue})
    //         .then((response) => {
    //         set_red_team_players(response.data.redTeamPlayers);
    //         set_blue_team_players(response.data.blueTeamPlayers);
    //     });

    // }

    if(!loading)
    {
        return(
            <DataContext.Provider value={{players, teams, main_game_info, redTeamPlayers, blueTeamPlayers, tempPlayerStats,
            view, loading, fetchData}}>
                {children}
                
            </DataContext.Provider>
        )
    }
}