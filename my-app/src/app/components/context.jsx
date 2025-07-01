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