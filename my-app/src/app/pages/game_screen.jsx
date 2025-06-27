'use client'
import react from "react";
import styles from "../page.module.css"
import PitcherChoices from "../components/pitcher_buttons";
import HitterChoices from "../components/hitter_buttons";
import { useState, useEffect } from "react";

export default function GameScreen()
{
    const [red_team_choices, set_red_team_choices] = useState("hitter");
    const [blue_team_choices, set_blue_team_choices] = useState("pitcher");
    const [current_outs, set_current_outs] = useState(0);
    const [current_inning, set_current_inning] = useState(1);
    const [current_strikes, set_current_strikes] = useState(0);
    const [top_of_inning, set_top_inning] = useState(false);
    const [first_base_active, set_first_base_active] = useState(false);
    const [second_base_active, set_second_base_active] = useState(false);
    const [third_base_active, set_third_base_active] = useState(false);
    // const [current_player, set_current_player_running] = useState({
    //     hit_score: 0
    // });    



    const switchPositions = () => {
        red_team_choices === "hitter" ? set_red_team_choices("pitcher") : set_red_team_choices("hitter");
        blue_team_choices === "pitcher" ? set_blue_team_choices("hitter") : set_blue_team_choices("pitcher");
        console.log(top_of_inning);
        set_top_inning(!top_of_inning);
        console.log(top_of_inning);
    }

    const incrementOuts = () =>
    {
        if(current_outs === 2)
        {
            switchPositions();
            console.log(top_of_inning);
            set_current_outs(0);
            set_current_strikes(0);
            if(top_of_inning)
            {
                set_current_inning(current_inning+1);
            }
        }
        else
        {
            set_current_outs(current_outs+1);
            set_current_strikes(0);
        }
        
    }

    const incrementStrikes = () => {
        current_strikes === 2 ? incrementOuts() : set_current_strikes(current_strikes+1);
    }

    const updateFBActive = (isActive) =>
    {
        console.log("Inside first base active");
        console.log(isActive);
        set_first_base_active(isActive);

        return;
    }

    const updateSBActive = (isActive) => {
        set_second_base_active(isActive);
        return;
    }

    const updateTBActive = (isActive) => {
        set_third_base_active(isActive);
        return;
    }


    const updateBases = (runs) =>{
        console.log("inside update bases");
        if(third_base_active === true)
        {
            updateTBActive(false);
        }
        if(second_base_active === true)
        {
            updateSBActive(false);
            if(2 + runs === 3)
            {
                updateTBActive(true);
            }
        }
        if(first_base_active === true)
        {
            updateFBActive(false);
            if(1 + runs === 2)
            {
                updateSBActive(true);
            }
            else if(1 + runs === 3)
            {
                updateTBActive(true);
            }
        }
        switch(runs){
            case 1: 
                updateFBActive(true);
                
                return;
            case 2: 
                updateSBActive(true);
                return;
            case 3:
                updateTBActive(true);
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
                    <h1 style={{textAlign: "center"}}>Team Red | Score: 0</h1>
                    <hr/>
                    {red_team_choices === "hitter" && (
                        <h2>Current Batter: _______</h2>
                    )}
                    {red_team_choices === "pitcher" && (
                        <h2>Current Pitcher: _______</h2>
                    )}
                    
                    <hr/>
                    <h3 style={{textAlign: "center"}}>Current Actions: </h3>
                    {red_team_choices === "hitter" && (
                    <div className={styles.choice_buttons_main}>
                        <span className={styles.player_buttons_red} onClick={() => {updateBases(1);}}>Single</span>
                        <span className={styles.player_buttons_red} onClick={() => {updateBases(2);}}>Double</span>
                        <span className={styles.player_buttons_red} onClick={() => {updateBases(3);}}>Triple</span>
                        <span className={styles.player_buttons_red} onClick={() => {updateBases(4);}}>Home Run</span>
                    </div>
                    )}
                    {red_team_choices === "pitcher" && (
                    <div className={styles.choice_buttons_main}>
                        <span className={styles.player_buttons_red} onClick={() => {incrementOuts();}}>Out</span>
                        <span className={styles.player_buttons_red} onClick={() => {incrementStrikes();}}>Strike</span>
                    </div>
                    )}

                    

                </div>
                <div className={styles.team_blue_banner}>
                    <h1 style={{textAlign: "center"}}>Team Blue | Score: 0</h1>
                    <hr/>
                    {blue_team_choices === "hitter" && (
                        <h2>Current Batter: _______</h2>
                    )}
                    {blue_team_choices === "pitcher" && (
                        <h2>Current Pitcher: _______</h2>
                    )}
                    <hr/>
                    <h3 style={{textAlign: "center"}}>Current Actions: </h3>
                    
                    {blue_team_choices === "pitcher" && (
                    <div className={styles.choice_buttons_main}>
                        <span className={styles.player_buttons_blue} onClick={() => {incrementOuts();}}>Out</span>
                        <span className={styles.player_buttons_blue} onClick={() => {incrementStrikes();}}>Strike</span>
                    </div>
                    )}
                    {blue_team_choices === "hitter" && (
                    <div className={styles.choice_buttons_main}>
                        <span className={styles.player_buttons_blue} onClick={() => {updateBases(1);}}>Single</span>
                        <span className={styles.player_buttons_blue} onClick={() => {updateBases(2);}}>Double</span>
                        <span className={styles.player_buttons_blue} onClick={() => {updateBases(3);}}>Triple</span>
                        <span className={styles.player_buttons_blue} onClick={() => {updateBases(4);}}>Home Run</span>
                    </div>
                    )}
                    
 
                </div>
            </div>
            <div className={styles.game_main_content}>
                    
                <div className={styles.game_field}>
                    <h1 className={styles.field_information}>Inning: {current_inning}</h1>
                    <h1 className={styles.field_information}>Outs: {current_outs}</h1>
                    <h1 className={styles.field_information}>Strikes: {current_strikes}</h1>
                    <div className={styles.inner_field}>
                        <div className={styles.home_base}>
                        <div className={styles.home_base_plate}></div>
                        
                    </div>
                    <div className={first_base_active ? `${styles.first_base} ${red_team_choices === "hitter" ? styles.active_base_red : styles.active_base_blue}` : styles.first_base} ></div>
                    <div className={second_base_active ? `${styles.second_base} ${red_team_choices === "hitter" ? styles.active_base_red : styles.active_base_blue}` : styles.second_base}></div>
                    <div className={third_base_active ? `${styles.third_base} ${red_team_choices === "hitter" ? styles.active_base_red : styles.active_base_blue}` : styles.third_base}></div>
                    <div className={styles.pitchers_mound}>
                        <div className={styles.pitchers_plate} style={{backgroundColor: red_team_choices === "pitcher" ? "red" : "blue"}}></div>
                    </div>
                    </div>

                </div>
                <div className={styles.logger_section}>
                    <h2 style={{textAlign: "center"}}>Game Logs</h2>
                    <div className={styles.logger_content}></div>
                </div>
            </div>
            <div className={styles.footer}>
                Created by Vedant Vyas, circa 2025
            </div>   
        </div>
    )
}