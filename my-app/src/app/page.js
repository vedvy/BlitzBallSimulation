//npm run dev inside /src/app to start the development server.

import Image from "next/image";
// import styles from "./page.module.css"
import GameScreen from "./client/pages/game_screen";
import { DataProvider } from "./client/components/context.jsx";
/*Figure out tomorrow morning or smthg if this context and provider work before doing server and mongo stuff*/

export default function Home() {
  return (
    <div className="main_program">
      <DataProvider>
        <GameScreen/>
      </DataProvider>
      
      
    </div>
  );
}
