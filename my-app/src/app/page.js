import Image from "next/image";
import styles from "./page.module.css"
import GameScreen from "./pages/game_screen";

export default function Home() {
  return (
    <div className="main_program">
      <GameScreen/>
      
    </div>
  );
}
