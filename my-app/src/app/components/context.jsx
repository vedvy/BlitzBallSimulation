'use client'

import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({children}) => {
    const [players, set_players] = useState([]);
    const [teams, set_teams] = useState([]);
    const [main_game_info, set_main_game_info] = useState([]);
    const [loading, set_loading] = useState(false);

    const fetchData = async() =>
    {
        /*Insert mongodb calls here!!*/
        set_loading(true);

        const playerResponse = await axios.get("/players");
        set_players(playerResponse.data);

        const teamResponse = await axios.get("/teams");
        set_teams(teamResponse.data);

        const mainGameResponse = await axios.get("/maingame");
        set_main_game_info(mainGameResponse.data);

        set_loading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    if(!loading)
    {
        return(
            <DataContext.Provider value={{players, teams, main_game_info, fetchData}}>
                {children}
            </DataContext.Provider>
        )
    }
}