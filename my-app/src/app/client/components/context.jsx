'use client'

import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({children}) => {
    const [players, set_players] = useState([]);
    const [teams, set_teams] = useState([]);
    const [main_game_info, set_main_game_info] = useState([]);
    const [loading, set_loading] = useState(true);


    const fetchData = async() =>
    {

        set_loading(true);
        console.log("Loading: ",loading);
        console.log("Obtaining Players");
        const playerResponse = await axios.get("http://localhost:8000/players");

        set_players(playerResponse.data);

        const teamResponse = await axios.get("http://localhost:8000/teams");
        set_teams(teamResponse.data);

        const mainGameResponse = await axios.get("http://localhost:8000/maingame");
        set_main_game_info(mainGameResponse.data);

        set_loading(false);
        console.log("Loading: ", loading);
    }

    useEffect(() => {
     fetchData();
    }, []);

    if(!loading)
    {
        return(
            <DataContext.Provider value={{players, teams, main_game_info, loading, fetchData}}>
                {children}
            </DataContext.Provider>
        )
    }
}