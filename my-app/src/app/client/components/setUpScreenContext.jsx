'use client'

import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const SetUpScreenDataContext = createContext();

export const SetUpScreenDataProvider = ({children}) => {
    const [players, set_players] = useState([]);
    const [loading, set_loading] = useState(true);

    const  setUpFetchData = async() => 
    {
        set_loading(true);
        const playerResponse = await axios.get("http://localhost:8000/players");

        set_players(playerResponse.data);
        set_loading(false);
    }

    useEffect(() => {
        setUpFetchData();
    }, []);

    if(!loading)
    {
        return(
            <SetUpScreenDataContext.Provider value={{players, loading, setUpFetchData}}>
                {children}
            </SetUpScreenDataContext.Provider>
        )
    }
}

