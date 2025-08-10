'use client'
import react from "react";
import styles from "../page.module.css";
import PitcherChoices from "../components/pitcher_buttons";
import HitterChoices from "../components/hitter_buttons";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "../components/context";
import main_game from "@/app/server/models/main_game";
import SelectPlayer from "../components/selectPlayer";
import GameField from "../components/gameField";
import EndGameScreen from "../components/endGameScreen";

export default function GameScreen()
{ 
   

    const dataModel = useContext(DataContext);
    if(!dataModel.loading)
    {
        console.log(dataModel.main_game_info[0].teamBlue);
        console.log("Team Red Teammates: ", dataModel.teams[0].teamChoices);

        var teamRed = dataModel.teams[0];
        var teamBlue = dataModel.teams[1];
        var mainGameInfo = dataModel.main_game_info[0];
        var tempPlayerOBJ = dataModel.tempPlayerStats[0];
        var redTeamPlayers = dataModel.redTeamPlayers;
        var blueTeamPlayers = dataModel.blueTeamPlayers;


        
        // console.log("Team Red: ", dataModel.main_game_info.teamRed);
    }
    const [localStrikes, set_local_strikes] = useState(mainGameInfo.currentStrikes);
    const [localBalls, set_local_balls] = useState(mainGameInfo.currentBalls);
    const [localHBP, set_local_HBP] = useState(mainGameInfo.currentHBP);

    const [outOptionsOn, set_outOptions] = useState(false);
    const [outType, set_outType] = useState();
    const [outFielder, set_outFielder] = useState();
    

    const incrementOuts = async (isStrikeOut, playerName) =>
    {
        if(mainGameInfo.currentOuts === 2)
        {
            console.log("Switching Team Positions");

            await axios.post("http://localhost:8000/switchPositions", {redTeam: teamRed, 
            blueTeam: teamBlue, 
            main_game_info: mainGameInfo});


            await axios.post("http://localhost:8000/incrementOuts", {main_game_info: mainGameInfo, 
                resetOuts: true, teamRed: teamRed, teamBlue: teamBlue, isStrikeOut: isStrikeOut
                , outType: outType, outFielder: playerName
            });

            if(mainGameInfo.topOfInning)
            {
                if(mainGameInfo.currentInning === 3) //Prompt for possible 4th inning/overtime
                {
                    
                    await axios.post("http://localhost:8000/updateGameOver", {
                        main_game_info: mainGameInfo, forceQuit: false
                    });
                    await dataModel.fetchData("gameOver");
                    return;

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
                resetOuts: false, teamRed: teamRed, teamBlue: teamBlue, isStrikeOut: isStrikeOut, 
                outType: outType, outFielder: playerName
            });
        }
        await dataModel.fetchData("selectPlayer");
        
    }

    const incrementStrikes = async () => {
        
        if(mainGameInfo.currentStrikes === 2 || localStrikes === 2)
        {
            set_local_strikes(0);
            let playerName = teamRed.teamChoices === "pitcher" ? teamRed.currentPlayerDisplay : teamBlue.currentPlayerDisplay;
            await incrementOuts(true, playerName);
            
        }
        else
        {
            await axios.post("http://localhost:8000/incrementStrikes", {main_game_info: mainGameInfo});
            mainGameInfo.currentStrikes++;
            set_local_strikes(mainGameInfo.currentStrikes);
        }
 
    }

    const incrementBalls = async () => {
        if(mainGameInfo.currentBalls === 4 || localBalls === 4)
        {
            if(!mainGameInfo.firstBaseActive.isActive)
            {
                await updateFBActive(true, null, true, false);
                await dataModel.fetchData("selectPlayer");
                return;
            }
            else
            {
                await updateBases(1, true, false);
            }
        }
        else
        {
            await axios.post("http://localhost:8000/incrementBalls", {main_game_info: mainGameInfo});
            mainGameInfo.currentBalls++;
            set_local_balls(mainGameInfo.currentBalls);
        }
    }

    const incrementHBP = async () => {
        if(mainGameInfo.currentHBP === 1 || localHBP === 1)
        {
            if(!mainGameInfo.firstBaseActive.isActive)
            {
                await updateFBActive(true, null, false, true);
                await dataModel.fetchData("selectPlayer");
                return;
            }
            else
            {
                await updateBases(1, false, true);
            }
        }
        else
        {
            await axios.post("http://localhost:8000/incrementHBP", {main_game_info: mainGameInfo});
            mainGameInfo.currentHBP++;
            set_local_HBP(mainGameInfo.currentHBP);
        }
    }

    const updateFBActive = async (isActive, currentPlayerOnPlate, BBFlag, HBPFlag) =>
    {
        console.log("Inside first base active");
        if(currentPlayerOnPlate)
        {
            await axios.post("http://localhost:8000/updateFirstBase", {main_game_info: mainGameInfo,
            isActive: isActive, currentPlayer: currentPlayerOnPlate, tempPlayerOBJ: tempPlayerOBJ
            });
        }
        else
        {
            let currentHitterPlayer = teamRed.teamChoices === "hitter" ? teamRed.currentPlayerDisplay : teamBlue.currentPlayerDisplay;
            let currentPitchingPlayer = teamRed.teamChoices === "pitcher" ? teamRed.currentPlayerDisplay : teamBlue.currentPlayerDisplay;
            await axios.post("http://localhost:8000/updateFirstBase", {main_game_info: mainGameInfo,
            isActive: isActive, currentHitterPlayer: currentHitterPlayer, currentPitchingPlayer: currentPitchingPlayer, tempPlayerOBJ: tempPlayerOBJ,
            BBFlag: BBFlag, HBPFlag: HBPFlag
        });
        }
        
    
        console.log(isActive);
        

        return;
    }

    const updateSBActive = async (isActive, currentPlayerOnPlate) => {
        if(currentPlayerOnPlate)
        {
            await axios.post("http://localhost:8000/updateSecondBase", {main_game_info: mainGameInfo,
            isActive: isActive, currentPlayer: currentPlayerOnPlate
            });
        }
        else
        {
            let currentHitterPlayer = teamRed.teamChoices === "hitter" ? teamRed.currentPlayerDisplay : teamBlue.currentPlayerDisplay;
            let currentPitchingPlayer = teamRed.teamChoices === "pitcher" ? teamRed.currentPlayerDisplay : teamBlue.currentPlayerDisplay;

            await axios.post("http://localhost:8000/updateSecondBase", {main_game_info: mainGameInfo,
            isActive: isActive, currentHitterPlayer: currentHitterPlayer, currentPitchingPlayer: currentPitchingPlayer
        });
        }

        return;
    }

    const updateTBActive = async (isActive, currentPlayerOnPlate) => {
        if(currentPlayerOnPlate)
        {
            await axios.post("http://localhost:8000/updateThirdBase", {main_game_info: mainGameInfo,
            isActive: isActive, currentPlayer: currentPlayerOnPlate
            });
        }
        else
        {
            let currentHitterPlayer = teamRed.teamChoices === "hitter" ? teamRed.currentPlayerDisplay : teamBlue.currentPlayerDisplay;
            let currentPitchingPlayer = teamRed.teamChoices === "pitcher" ? teamRed.currentPlayerDisplay : teamBlue.currentPlayerDisplay;

            await axios.post("http://localhost:8000/updateThirdBase", {main_game_info: mainGameInfo,
            isActive: isActive, currentHitterPlayer: currentHitterPlayer, currentPitchingPlayer: currentPitchingPlayer
        });
        }

        return;
    }


    const updateBases = async (runs, BBFlag, HBPFlag) =>{
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
                let currentPlayer = mainGameInfo.secondBaseActive.playerOnPlateDisplay;
                await updateTBActive(true, currentPlayer);
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
               let currentPlayer = mainGameInfo.firstBaseActive.playerOnPlateDisplay; 
               await updateSBActive(true, currentPlayer);
            }
            else if(1 + runs === 3)
            {
               let currentPlayer = mainGameInfo.firstBaseActive.playerOnPlateDisplay; 
               await updateTBActive(true, currentPlayer);
            }
            else
            {
                score_increment++;
            }
        }
        switch(runs){
            case 1: 
                console.log("Case 1 active");
                await updateFBActive(true, null, BBFlag, HBPFlag);
                if(teamRed.teamChoices === "hitter")
                {
                    let gameLog = `${teamRed.currentPlayerDisplay} has hit a single!`;
                    await axios.post("http://localhost:8000/updateScores", 
                        {updateRedScores: true, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment,
                            mainGameInfo: mainGameInfo, gameLog: gameLog
                        }
                    );
                }
                else
                {
                    let gameLog = `${teamBlue.currentPlayerDisplay} has hit a single!`;
                    await axios.post("http://localhost:8000/updateScores", 
                        {updateRedScores: false, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment,
                            mainGameInfo: mainGameInfo, gameLog: gameLog
                        }
                    );
                }
                await dataModel.fetchData("selectPlayer");
                console.log(dataModel.main_game_info[0].firstBaseActive);
                return;
            case 2: 
                await updateSBActive(true);
                if(teamRed.teamChoices === "hitter")
                {
                    let gameLog = `${teamRed.currentPlayerDisplay} has hit a double!`;
                    await axios.post("http://localhost:8000/updateScores", 
                        {updateRedScores: true, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment,
                            mainGameInfo: mainGameInfo, gameLog: gameLog
                        }
                    );
                }
                else
                {
                    let gameLog = `${teamBlue.currentPlayerDisplay} has hit a double!`;
                    await axios.post("http://localhost:8000/updateScores", 
                        {updateRedScores: false, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment,
                            mainGameInfo: mainGameInfo, gameLog: gameLog
                        }
                    );
                }
                await dataModel.fetchData("selectPlayer"); 
                return;
            case 3:
                await updateTBActive(true);
                if(teamRed.teamChoices === "hitter")
                {
                    let gameLog = `${teamRed.currentPlayerDisplay} has hit a triple!`;
                    await axios.post("http://localhost:8000/updateScores", 
                        {updateRedScores: true, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment,
                            mainGameInfo: mainGameInfo, gameLog: gameLog
                        }
                    );
                }
                else
                {
                    let gameLog = `${teamBlue.currentPlayerDisplay} has hit a triple!`;
                    await axios.post("http://localhost:8000/updateScores", 
                        {updateRedScores: false, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment,
                            mainGameInfo: mainGameInfo, gameLog: gameLog
                        }
                    );
                }
                await dataModel.fetchData("selectPlayer");
                return;
            default:
                score_increment++;
                let currentHitterPlayer = teamRed.teamChoices === "hitter" ? teamRed.currentPlayerDisplay : teamBlue.currentPlayerDisplay;
                let currentPitchingPlayer = teamRed.teamChoices === "pitcher" ? teamRed.currentPlayerDisplay : teamBlue.currentPlayerDisplay;
                await axios.post("http://localhost:8000/updateHRStat", {currentHitterPlayer: currentHitterPlayer,
                    currentPitchingPlayer: currentPitchingPlayer
                });
                if(teamRed.teamChoices === "hitter")
                {
                    let gameLog = `${teamRed.currentPlayerDisplay} has gone far and smashed a home run!!!`;
                    await axios.post("http://localhost:8000/updateScores", 
                        {updateRedScores: true, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment,
                            mainGameInfo: mainGameInfo, gameLog: gameLog
                        }
                    );
                }
                else
                {
                    let gameLog = `${teamBlue.currentPlayerDisplay} cracked the bat and scored a home run!!!`;
                    await axios.post("http://localhost:8000/updateScores", 
                        {updateRedScores: false, teamRed: teamRed, teamBlue: teamBlue, score_increment: score_increment,
                            mainGameInfo: mainGameInfo, gameLog: gameLog
                        }
                    );
                }
                await dataModel.fetchData("selectPlayer");
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
                        <h2 style={{textAlign: "center"}}>Current Batter: {teamRed.currentPlayerDisplay}</h2>
                    )}
                    {teamRed.teamChoices === "pitcher" && (
                        <h2 style={{textAlign: "center"}}>Current Pitcher: {teamRed.currentPlayerDisplay}</h2>
                    )}
                    
                    <hr/>
                    <h3 style={{textAlign: "center"}}>Current Actions: </h3>
                    {teamRed.teamChoices === "hitter" && (
                    (!mainGameInfo.gameOver && dataModel.view === "gameField" && <div className={styles.choice_buttons_main}>
                        <span className={styles.player_buttons_red} onClick={async () => {await updateBases(1);}}>Single</span>
                        <span className={styles.player_buttons_red} onClick={async () => {await updateBases(2);}}>Double</span>
                        <span className={styles.player_buttons_red} onClick={async () => {await updateBases(3);}}>Triple</span>
                        <span className={styles.player_buttons_red} onClick={async () => {await updateBases(4);}}>Home Run</span>
                    </div>)
                    )}
                    {teamRed.teamChoices === "pitcher" && (
                    (!mainGameInfo.gameOver && dataModel.view === "gameField" && <div className={styles.choice_buttons_main}>
                        
                        {!outOptionsOn && 
                        <div>
                            <span className={styles.player_buttons_red} onClick={() => {set_outOptions(true);}}>Out</span>
                            <span className={styles.player_buttons_red} onClick={async () => {await incrementStrikes();}}>Strike</span>
                            <span className={styles.player_buttons_red} onClick={async () => {await incrementBalls();}}>Ball</span>
                            <span className={styles.player_buttons_red} onClick={async () => {await incrementHBP();}}>Hit By Pitch</span>    
                        </div>}
                        {outOptionsOn && !outType &&
                        <div>
                            <span className={styles.player_buttons_red} onClick={() => {set_outType("GroundOut");}}>GroundOut</span>
                            <span className={styles.player_buttons_red} onClick={() => {set_outType("LineOut");}}>LineOut</span>
                            <span className={styles.player_buttons_red} onClick={() => {set_outType("PopOut");}}>PopOut</span>
                            <span className={styles.player_buttons_red} onClick={() => {set_outType(); set_outOptions(false);}}>Cancel</span>
                        </div>}
                        {outOptionsOn && outType &&
                        <div>
                            {redTeamPlayers.map((player, index) => 
                            <span className={styles.player_buttons_red} key={index} onClick={async () => {set_outFielder(player); await incrementOuts(false, player);}}>{player}</span>
                            )}
                            <span className={styles.player_buttons_blue} onClick={() => {set_outType(false); set_outOptions(false); set_outFielder();}}>Cancel</span>
                        </div>}

                        
                    </div>)
                    )}
                </div>
                <div className={styles.team_blue_banner}>
                    <h1 style={{textAlign: "center"}}>Team Blue | Score: {teamBlue.teamScore}</h1>
                    <hr/>
                    {teamBlue.teamChoices === "hitter" && (
                        <h2 style={{textAlign: "center"}}>Current Batter: {teamBlue.currentPlayerDisplay}</h2>
                    )}
                    {teamBlue.teamChoices === "pitcher" && (
                        <h2 style={{textAlign: "center"}}>Current Pitcher: {teamBlue.currentPlayerDisplay}</h2>
                    )}
                    <hr/>
                    <h3 style={{textAlign: "center"}}>Current Actions: </h3>
                    
                    {teamBlue.teamChoices === "pitcher" && (
                    (!mainGameInfo.gameOver && dataModel.view === "gameField" && <div className={styles.choice_buttons_main}>
                        {!outOptionsOn && 
                        <div>
                            <span className={styles.player_buttons_blue} onClick={() => {set_outOptions(true);}}>Out</span>
                            <span className={styles.player_buttons_blue} onClick={async () => {await incrementStrikes();}}>Strike</span>
                            <span className={styles.player_buttons_blue} onClick={async () => {await incrementBalls();}}>Ball</span>
                            <span className={styles.player_buttons_blue} onClick={async () => {await incrementHBP();}}>Hit By Pitch</span>    
                        </div>}
                        {outOptionsOn && !outType &&
                        <div>
                            <span className={styles.player_buttons_blue} onClick={() => {set_outType("GroundOut");}}>GroundOut</span>
                            <span className={styles.player_buttons_blue} onClick={() => {set_outType("LineOut");}}>LineOut</span>
                            <span className={styles.player_buttons_blue} onClick={() => {set_outType("PopOut");}}>PopOut</span>
                            <span className={styles.player_buttons_blue} onClick={() => {set_outType(false); set_outOptions(false)}}>Cancel</span>
                        </div>}
                        {outOptionsOn && outType &&
                        <div>
                            {redTeamPlayers.map((player, index) => 
                            <span className={styles.player_buttons_blue} key={index} onClick={async () => {set_outFielder(player); await incrementOuts(false, player);}}>{player}</span>
                            )}
                            <span className={styles.player_buttons_blue} onClick={() => {set_outType(false); set_outOptions(false); set_outFielder();}}>Cancel</span>
                        </div>}
                    </div>)
                    )}
                    {teamBlue.teamChoices === "hitter" && (
                    (!mainGameInfo.gameOver && dataModel.view === "gameField" && <div className={styles.choice_buttons_main}>
                        <span className={styles.player_buttons_blue} onClick={async () => {await updateBases(1);}}>Single</span>
                        <span className={styles.player_buttons_blue} onClick={async () => {await updateBases(2);}}>Double</span>
                        <span className={styles.player_buttons_blue} onClick={async () => {await updateBases(3);}}>Triple</span>
                        <span className={styles.player_buttons_blue} onClick={async () => {await updateBases(4);}}>Home Run</span>
                    </div>)
                    )}
                    
 
                </div>
            </div>
            {dataModel.view !== "gameOver" && 
                <GameField
                dataModel={dataModel}
                mainGameInfo={mainGameInfo}
                strikes={localStrikes}
                balls={localBalls}
                hitByPitches={localHBP}
                teamRed={teamRed}
                teamBlue={teamBlue}
            />}
            {dataModel.view === "gameOver" && 
            <EndGameScreen
            teamRed={teamRed}
            teamBlue={teamBlue}
            mainGameInfo={mainGameInfo}
            />
            }

            <div className={styles.footer}>
                Created by Vedant Vyas, circa 2025
            </div>   
        </div>
    )
}