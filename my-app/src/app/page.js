//npm run dev inside /src/app to start the development server.

import Image from "next/image";
// import styles from "./page.module.css"
import GameScreen from "./client/pages/game_screen";
import SetUpScreen from "./client/pages/game_setup_screen";
// import { DataProvider, DataContext } from "./client/components/context.jsx";
import { SetUpScreenDataContext, SetUpScreenDataProvider } from "./client/components/setUpScreenContext";

import { useContext } from "react";
/*Add the Creation Screen here and determine how to structure it in the Provider.*/
/*Now figure out how to make DataContext work when you submit the info from SetUpScreen*/

export default function Home() {

  return (
    <div className="main_program">
      <SetUpScreenDataProvider>
        <SetUpScreen/>
      </SetUpScreenDataProvider>
    </div>
  );
}

{/* <DataProvider>
        <GameScreen/>
      </DataProvider> */}