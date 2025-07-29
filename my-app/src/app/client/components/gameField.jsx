import styles from "../page.module.css";
import SelectPlayer from "./selectPlayer";
import EndGameScreen from "./endGameScreen";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "../components/context";
import axios from "axios";

export default function GameField(
    {
        dataModel,
        mainGameInfo,
        strikes,
        balls,
        hitByPitches,
        teamRed,
        teamBlue,
    })
{

    /*Add Mercy Rule to Force Quit Prompt*/
    mainGameInfo.logMessages.map((log, index) => {
        console.log(log);
    });
    
    const [quitFlag, set_quit_flag] = useState(false);
    const [formData, set_form_data] = useState({
        confirmationText: ""
    })

    const handleChanges = (event) => {
        const {name, value} = event.target;
        console.log(event.target);

        set_form_data({
            ...formData,
            [name]: value
        });
    }

    const confirmQuit = async (event) => {
        event.preventDefault();
        
        const confirmText = formData.confirmationText.trim();
        console.log(confirmText);
        if(confirmText === "ForceQuit")
        {
            await axios.post("http://localhost:8000/updateGameOver", {main_game_info: mainGameInfo, forceQuit: true})
            await dataModel.fetchData("gameOver");
        }
    }

    const incrementOuts = async () =>
        {
            if(mainGameInfo.currentOuts === 2)
            {
                console.log("Switching Team Positions");
                await axios.post("http://localhost:8000/switchPositions", {redTeam: teamRed, 
                blueTeam: teamBlue, 
                main_game_info: mainGameInfo});

                await axios.post("http://localhost:8000/incrementOuts", {main_game_info: mainGameInfo, 
                    resetOuts: true
                });
    
                if(mainGameInfo.topOfInning)
                {
                    if(mainGameInfo.currentInning === 3)
                    {
                        var logger = document.getElementById("game_log");
                        console.log(logger);
                        var log = document.createElement("div");
                        if(teamRed.teamScore === teamBlue.teamScore)
                        {
                            log.textContent = "It's a Tie!";
                            logger.append(log);
                        }
                        else{
                            log.textContent = (teamRed.teamScore > teamBlue.teamScore ? "red team wins" : "blue team wins");
                            log.className = (teamRed.teamScore > teamBlue.teamScore ? styles.log_text_red : styles.log_text_blue);
                            logger.append(log);
                        }
                        
                        await axios.post("http://localhost:8000/updateGameOver", {
                            main_game_info: mainGameInfo,
                            forceQuit: false
                        });
                    }
                    else
                    {
                        
                        await axios.post("http://localhost:8000/updateInnings", {
                            main_game_info: mainGameInfo
                        });
    
                    }
                    
                    
                }
            }
            else
            {
                await axios.post("http://localhost:8000/incrementOuts", {main_game_info: mainGameInfo, 
                    resetOuts: false
                });
            }
            await dataModel.fetchData();
            
        }
    
        const incrementStrikes = async () => {
            // mainGameInfo.currentStrikes === 2 ? incrementOuts() : set_current_strikes(current_strikes+1);
            if(mainGameInfo.currentStrikes === 2)
            {
                await incrementOuts();
            }
            else
            {
                await axios.post("http://localhost:8000/incrementStrikes", {main_game_info: mainGameInfo});
            }
           await dataModel.fetchData();
        }
    
        const updateFBActive = async (isActive) =>
        {
            console.log("Inside first base active");
            console.log(isActive);
            await axios.post("http://localhost:8000/updateFirstBase", {main_game_info: mainGameInfo,
                isActive: isActive
            });
    
            return;
        }
    
        const updateSBActive = async (isActive) => {
            await axios.post("http://localhost:8000/updateSecondBase", {main_game_info: mainGameInfo,
                isActive: isActive
            });
    
            return;
        }
    
        const updateTBActive = async (isActive) => {
            await axios.post("http://localhost:8000/updateThirdBase", {main_game_info: mainGameInfo,
                isActive: isActive
            });
    
            return;
        }
    
    
        const updateBases = async (runs) =>{
            console.log("inside update bases");
            var score_increment = 0;
            if(mainGameInfo.thirdBaseActive.isActive === true)
            {
                console.log("third base was active");
                await updateTBActive(false);
                score_increment++;
    
            }
            if(mainGameInfo.secondBaseActive.isActive === true)
            {
                console.log("second base was active");
                await updateSBActive(false);
                if(2 + runs === 3)
                {
                    await updateTBActive(true);
                }
                else{
                    score_increment++;
                }
            }
            if(mainGameInfo.firstBaseActive.isActive === true)
            {
                console.log("first base was active");
                await updateFBActive(false);
                if(1 + runs === 2)
                {
                   await updateSBActive(true);
                }
                else if(1 + runs === 3)
                {
                   await updateTBActive(true);
                }
                else
                {
                    score_increment++;
                }
            }
            switch(runs){
                case 1: 
                    console.log("Case 1 active");
                    await updateFBActive(true);
                    if(teamRed.teamChoices === "hitter")
                    {
                        await axios.post("http://localhost:8000/updateScores", 
                            {updateRedScores: true, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment}
                        );
                    }
                    else
                    {
                        await axios.post("http://localhost:8000/updateScores", 
                            {updateRedScores: false, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment}
                        );
                    }
                    await dataModel.fetchData();
                    console.log(dataModel.main_game_info[0].firstBaseActive);
                    return;
                case 2: 
                    await updateSBActive(true);
                    if(teamRed.teamChoices === "hitter")
                    {
                        await axios.post("http://localhost:8000/updateScores", 
                            {updateRedScores: true, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment}
                        );
                    }
                    else
                    {
                        await axios.post("http://localhost:8000/updateScores", 
                            {updateRedScores: false, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment}
                        );
                    }
                    await dataModel.fetchData(); 
                    return;
                case 3:
                    await updateTBActive(true);
                    if(teamRed.teamChoices === "hitter")
                    {
                        await axios.post("http://localhost:8000/updateScores", 
                            {updateRedScores: true, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment}
                        );
                    }
                    else
                    {
                        await axios.post("http://localhost:8000/updateScores", 
                            {updateRedScores: false, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment}
                        );
                    }
                    await dataModel.fetchData();
                    return;
                default:
                    score_increment++;
                    if(teamRed.teamChoices === "hitter")
                    {
                        await axios.post("http://localhost:8000/updateScores", 
                            {updateRedScores: true, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment}
                        );
                    }
                    else
                    {
                        await axios.post("http://localhost:8000/updateScores", 
                            {updateRedScores: false, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment}
                        );
                    }
                    await dataModel.fetchData();
                    return;
    
            }
            
        }

    return (<div className={styles.game_main_content}>
                    {dataModel.view === "gameField" && <div className={styles.game_field}>
                        <h1 className={styles.field_information}>Inning: {mainGameInfo.currentInning}</h1>
                        <h1 className={styles.field_information}>Outs: {mainGameInfo.currentOuts}</h1>
                        <h1 className={styles.field_information}>Strikes: {strikes}</h1>
                        <h1 className={styles.field_information}>Balls: {balls}</h1>
                        <h1 className={styles.field_information}>HBP: {hitByPitches}</h1>
                        <br/>
                        {!quitFlag && <button className={styles.quitEarlyButton} onClick={() => {set_quit_flag(true);}}>Quit Early</button>}
                        {quitFlag && <div>
                            <form onSubmit={confirmQuit}>
                            <textarea 
                            name="confirmationText"
                            placeholder="Enter ForceQuit to confirm"
                            value={formData.confirmationText} 
                            onChange={handleChanges}
                            maxLength={20}>
                            </textarea>
                            <button type="submit" className={styles.quitSubmitButton}>Enter</button>
                            <button onClick={() => {set_quit_flag(false);}} className={styles.quitCancelButton}>Cancel</button>
                            </form>
                               
                            </div>

                            }
                        <div className={styles.inner_field}>
                            <div className={styles.home_base}>
                            <div className={styles.home_base_plate}></div>
                        </div>
                        <div className={mainGameInfo.firstBaseActive.isActive ? `${styles.first_base} ${teamRed.teamChoices === "hitter" ? styles.active_base_red : styles.active_base_blue}` : styles.first_base} >
                            <span>{mainGameInfo.firstBaseActive.playerOnPlateDisplay}</span>
                        </div>
                        <div className={mainGameInfo.secondBaseActive.isActive ? `${styles.second_base} ${teamRed.teamChoices === "hitter" ? styles.active_base_red : styles.active_base_blue}` : styles.second_base}>
                            <span>{mainGameInfo.secondBaseActive.playerOnPlateDisplay}</span>
                        </div>
                        <div className={mainGameInfo.thirdBaseActive.isActive ? `${styles.third_base} ${teamRed.teamChoices === "hitter" ? styles.active_base_red : styles.active_base_blue}` : styles.third_base}>
                            <span>{mainGameInfo.thirdBaseActive.playerOnPlateDisplay}</span>
                        </div>
                        <div className={styles.pitchers_mound}>
                            <div className={styles.pitchers_plate} style={{backgroundColor: teamRed.teamChoices === "pitcher" ? "red" : "blue"}}></div>
                        </div>
                        </div>
                    
                    </div>}
                    {dataModel.view === "selectPlayer" && <div className={styles.game_field}>
                        <SelectPlayer/>
                    </div>
                    
                    }
                    
                    <div className={styles.logger_section}>
                        <h2 style={{textAlign: "center"}}>Game Logs</h2>
                        <div className={styles.logger_content} id="game_log">
                            {mainGameInfo.logMessages.map((log, index) => 
                                <p key={index} className={styles.logMessages}>{log}</p>
                            )}
                        </div>
                    </div>
                </div>)
}