'use client'

import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const SetUpScreenDataContext = createContext();

export const SetUpScreenDataProvider = ({children}) => {
    const [players, set_players] = useState([]);
    const [current_page, set_current_page] = useState("AddDeletePage");
    const [loading, set_loading] = useState(true);

    const setUpFetchData = async (page_view) => 
    {
        set_loading(true);
        const playerResponse = await axios.get("http://localhost:8000/players");

        set_players(playerResponse.data);

        if(!page_view)
        {
            set_current_page("AddDeletePage");
        }
        else
        {
            set_current_page(page_view);
        }
        set_loading(false);
    }

    useEffect(() => {
        setUpFetchData();
    }, []);

    if(loading) {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <h2>Loading setup data...</h2>
        </div>;
    }

    if(!loading)
    {
        return(
            <SetUpScreenDataContext.Provider value={{players, current_page, loading, setUpFetchData}}>
                {children}
            </SetUpScreenDataContext.Provider>
        )
    }
}

