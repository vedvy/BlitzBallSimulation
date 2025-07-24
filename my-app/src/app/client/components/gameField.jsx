import styles from "../page.module.css";

export default function GameField(
    {
        dataModel,
        mainGameInfo,
        strikes,
        balls,
        teamRed,
        teamBlue,

    })
{

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

    return (<div className={styles.game_main_content}> {/*dataModel view toggling problems here!*/}
                    <div className={styles.game_field}>
                        <h1 className={styles.field_information}>Inning: {mainGameInfo.currentInning}</h1>
                        <h1 className={styles.field_information}>Outs: {mainGameInfo.currentOuts}</h1>
                        <h1 className={styles.field_information}>Strikes: {strikes}</h1>
                        <h1 className={styles.field_information}>Balls: {balls}</h1>
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
                </div>)
}