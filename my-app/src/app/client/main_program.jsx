'use client'
import GameScreen from "./pages/game_screen";
import SetUpScreen from "./pages/game_setup_screen";
import { DataProvider, DataContext } from "./components/context.jsx";
import { SetUpScreenDataContext, SetUpScreenDataProvider } from "./components/setUpScreenContext";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

export default function MainProgram()
{
    const [screen_view, update_screen_view] = useState("SetUp");

    // useEffect(() => {
    //     async function fetchView()
    //     {
    //         try{
    //             console.log("Inside main program useffect");
    //             // let screenViewResponse = await axios.get("http://localhost:8000/screenview");
    //             // update_screen_view(screenViewResponse.data.screen_view);
    //         }
    //         catch(err){
    //             console.error(err);
    //         }
    //     };
    //     fetchView();
    // }, []);
    // console.log(screen_view);

    return (
        <div className="main_program">
          {screen_view === "SetUp" && 
          <SetUpScreenDataProvider>
            <SetUpScreen/>
          </SetUpScreenDataProvider>}
          {screen_view === "GameScreen" &&
          <DataProvider>
            <GameScreen/>
         </DataProvider>}
        </div>
      );
}