'use client'
import react from "react";
import styles from "../page.module.css";
import PitcherChoices from "../components/pitcher_buttons";
import HitterChoices from "../components/hitter_buttons";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "../components/context";
import main_game from "@/app/server/models/main_game";

export default function GameScreen()
{
    /**
     * Determine if there is a way to refactor the states here. Via multiple values in one state or convert some inside
     * a context? figure it out when implementing backend providers
     */

    /* 
    * Running into some stuff regarding the refreshes. Don't worry about it for now, work on setting up 
    * the backend and then we can go back to this.
    */
    
    // const [current_player, set_current_player_running] = useState({
    //     hit_score: 0
    // });    

    const dataModel = useContext(DataContext);
    if(!dataModel.loading)
    {
        console.log(dataModel.main_game_info[0].teamBlue);
        console.log("Team Red Teammates: ", dataModel.teams[0].teamChoices);

        var teamRed = dataModel.teams[0];
        var teamBlue = dataModel.teams[1];
        var mainGameInfo = dataModel.main_game_info[0];
        console.log(dataModel.main_game_info[0].firstBaseActive);


        
        // console.log("Team Red: ", dataModel.main_game_info.teamRed);
    }
    
    const [red_team_choices, set_red_team_choices] = useState("hitter");
    const [blue_team_choices, set_blue_team_choices] = useState("pitcher");
    const [red_score, set_red_score] = useState(0);
    const [blue_score, set_blue_score] = useState(0);
    
    const [current_outs, set_current_outs] = useState(0);
    const [current_inning, set_current_inning] = useState(1);
    const [current_strikes, set_current_strikes] = useState(0);
    const [top_of_inning, set_top_inning] = useState(false);
    const [first_base_active, set_first_base_active] = useState(false);
    const [second_base_active, set_second_base_active] = useState(false);
    const [third_base_active, set_third_base_active] = useState(false);
    const [game_over, set_game_over] = useState(false);


    // const switchPositions = async () => {
    //     await axios.post("http://localhost:8000/switchPositions", {redTeam: teamRed, 
    //         blueTeam: teamBlue, 
    //         main_game_info: mainGameInfo});

        
    //     red_team_choices === "hitter" ? set_red_team_choices("pitcher") : set_red_team_choices("hitter");
    //     blue_team_choices === "pitcher" ? set_blue_team_choices("hitter") : set_blue_team_choices("pitcher");
    //     set_first_base_active(false);
    //     set_second_base_active(false);
    //     set_third_base_active(false);
    //     console.log(top_of_inning);
    //     set_top_inning(!top_of_inning);
    //     console.log(top_of_inning);

    //     console.log(mainGameInfo.firstBaseActive);
    //     console.log("Team Red: ", teamRed.teamChoices);
    //     console.log("Team Blue", teamBlue.teamChoices);

    //     await dataModel.fetchData();
    // }

    const incrementOuts = async () =>
    {
        if(mainGameInfo.currentOuts === 2)
        {
            console.log("Switching Team Positions");
            await axios.post("http://localhost:8000/switchPositions", {redTeam: teamRed, 
            blueTeam: teamBlue, 
            main_game_info: mainGameInfo});

            console.log(top_of_inning);
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
                        main_game_info: mainGameInfo
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
        await dataModel.fetchData();
        return;
    }

    const updateSBActive = async (isActive) => {
        await axios.post("http://localhost:8000/updateSecondBase", {main_game_info: mainGameInfo,
            isActive: isActive
        });
        await dataModel.fetchData();
        return;
    }

    const updateTBActive = async (isActive) => {
        await axios.post("http://localhost:8000/updateThirdBase", {main_game_info: mainGameInfo,
            isActive: isActive
        });
        await dataModel.fetchData();
        return;
    }


    const updateBases = async (runs) =>{
        console.log("inside update bases");
        var score_increment = 0;
        if(mainGameInfo.thirdBaseActive === true)
        {
            console.log("third base was active");
            await updateTBActive(false);
            score_increment++;

        }
        if(mainGameInfo.secondBaseActive === true)
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
        if(mainGameInfo.firstBaseActive === true)
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


    return (
        <div className={styles.game_screen}>
            <div className={styles.banner}>
                <h1>Beta Testing for Game</h1>
            </div>
            <div className={styles.team_banners}>
                <div className={styles.team_red_banner}>
                    <h1 style={{textAlign: "center"}}>Team Red | Score: {teamRed.teamScore}</h1>
                    <hr/>
                    {teamRed.teamChoices === "hitter" && (
                        <h2>Current Batter: _______</h2>
                    )}
                    {teamRed.teamChoices === "pitcher" && (
                        <h2>Current Pitcher: _______</h2>
                    )}
                    
                    <hr/>
                    <h3 style={{textAlign: "center"}}>Current Actions: </h3>
                    {teamRed.teamChoices === "hitter" && (
                    (!mainGameInfo.gameOver && <div className={styles.choice_buttons_main}>
                        <span className={styles.player_buttons_red} onClick={async () => {await updateBases(1);}}>Single</span>
                        <span className={styles.player_buttons_red} onClick={async () => {await updateBases(2);}}>Double</span>
                        <span className={styles.player_buttons_red} onClick={async () => {await updateBases(3);}}>Triple</span>
                        <span className={styles.player_buttons_red} onClick={async () => {await updateBases(4);}}>Home Run</span>
                    </div>)
                    )}
                    {teamRed.teamChoices === "pitcher" && (
                    (!game_over && <div className={styles.choice_buttons_main}>
                        <span className={styles.player_buttons_red} onClick={async () => {await incrementOuts();}}>Out</span>
                        <span className={styles.player_buttons_red} onClick={async () => {await incrementStrikes();}}>Strike</span>
                    </div>)
                    )}

                    

                </div>
                <div className={styles.team_blue_banner}>
                    <h1 style={{textAlign: "center"}}>Team Blue | Score: {teamBlue.teamScore}</h1>
                    <hr/>
                    {teamBlue.teamChoices === "hitter" && (
                        <h2>Current Batter: _______</h2>
                    )}
                    {teamBlue.teamChoices === "pitcher" && (
                        <h2>Current Pitcher: _______</h2>
                    )}
                    <hr/>
                    <h3 style={{textAlign: "center"}}>Current Actions: </h3>
                    
                    {teamBlue.teamChoices === "pitcher" && (
                    (!mainGameInfo.gameOver && <div className={styles.choice_buttons_main}>
                        <span className={styles.player_buttons_blue} onClick={async () => {await incrementOuts();}}>Out</span>
                        <span className={styles.player_buttons_blue} onClick={async () => {await incrementStrikes();}}>Strike</span>
                    </div>)
                    )}
                    {teamBlue.teamChoices === "hitter" && (
                    (!mainGameInfo.gameOver && <div className={styles.choice_buttons_main}>
                        <span className={styles.player_buttons_blue} onClick={async () => {await updateBases(1);}}>Single</span>
                        <span className={styles.player_buttons_blue} onClick={async () => {await updateBases(2);}}>Double</span>
                        <span className={styles.player_buttons_blue} onClick={async () => {await updateBases(3);}}>Triple</span>
                        <span className={styles.player_buttons_blue} onClick={async () => {await updateBases(4);}}>Home Run</span>
                    </div>)
                    )}
                    
 
                </div>
            </div>
            <div className={styles.game_main_content}>
                    
                <div className={styles.game_field}>
                    <h1 className={styles.field_information}>Inning: {mainGameInfo.currentInning}</h1>
                    <h1 className={styles.field_information}>Outs: {mainGameInfo.currentOuts}</h1>
                    <h1 className={styles.field_information}>Strikes: {mainGameInfo.currentStrikes}</h1>
                    <div className={styles.inner_field}>
                        <div className={styles.home_base}>
                        <div className={styles.home_base_plate}></div>
                        
                    </div>
                    <div className={mainGameInfo.firstBaseActive ? `${styles.first_base} ${teamRed.teamChoices === "hitter" ? styles.active_base_red : styles.active_base_blue}` : styles.first_base} ></div>
                    <div className={mainGameInfo.secondBaseActive ? `${styles.second_base} ${teamRed.teamChoices === "hitter" ? styles.active_base_red : styles.active_base_blue}` : styles.second_base}></div>
                    <div className={mainGameInfo.thirdBaseActive ? `${styles.third_base} ${teamRed.teamChoices === "hitter" ? styles.active_base_red : styles.active_base_blue}` : styles.third_base}></div>
                    <div className={styles.pitchers_mound}>
                        <div className={styles.pitchers_plate} style={{backgroundColor: teamRed.teamChoices === "pitcher" ? "red" : "blue"}}></div>
                    </div>
                    </div>

                </div>
                <div className={styles.logger_section}>
                    <h2 style={{textAlign: "center"}}>Game Logs</h2>
                    <div className={styles.logger_content} id="game_log"></div>
                </div>
            </div>
            <div className={styles.footer}>
                Created by Vedant Vyas, circa 2025
            </div>   
        </div>
    )
}