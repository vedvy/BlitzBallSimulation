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

    const switchPositions = () => {
        red_team_choices === "hitter" ? set_red_team_choices("pitcher") : set_red_team_choices("hitter");
        blue_team_choices === "pitcher" ? set_blue_team_choices("hitter") : set_blue_team_choices("pitcher");

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
                    <h2>Current Batter: _______</h2>
                    <h2>Current Pitcher: _______</h2>
                    <hr/>
                    <h3 style={{textAlign: "center"}}>Current Actions: </h3>
                    {red_team_choices === "hitter" && (
                    <div className={styles.hitter_buttons_main}>
                        <span className={styles.player_buttons_red}>Base 1 Hit</span>
                    </div>
                    )}
                    {red_team_choices === "pitcher" && (
                    <div className={styles.hitter_buttons_main}>
                        <span className={styles.player_buttons_red} onClick={() => {switchPositions();}}>Out</span>
                    </div>
                    )}

                    

                </div>
                <div className={styles.team_blue_banner}>
                    <h1 style={{textAlign: "center"}}>Team Blue | Score: 0</h1>
                    <hr/>
                    <h2>Current Batter: _______</h2>
                    <h2>Current Pitcher: _______</h2>
                    <hr/>
                    <h3 style={{textAlign: "center"}}>Current Actions: </h3>
                    
                    {blue_team_choices === "pitcher" && (
                    <div className="pitcher_buttons_main">
                        <span className={styles.player_buttons_blue} onClick={() => {switchPositions();}}>Out</span>
                    </div>
                    )}
                    {blue_team_choices === "hitter" && (
                    <div className="pitcher_buttons_main">
                        <span className={styles.player_buttons_blue}>Base 1 Hit</span>
                    </div>
                    )}
                    
 
                </div>
            </div>
            <div className={styles.game_main_content}>
                    
                <div className={styles.game_field}>
                    <h1 className={styles.field_information}>Inning: </h1>
                    <h1 className={styles.field_information}>Outs: </h1>
                    <h1 className={styles.field_information}>Strikes: </h1>
                    <div className={styles.inner_field}>
                        <div className={styles.home_base}>
                        <div className={styles.home_base_plate}></div>
                        
                    </div>
                    <div className={styles.first_base}></div>
                    <div className={styles.second_base}></div>
                    <div className={styles.third_base}></div>
                    <div className={styles.pitchers_mound}>
                        <div className={styles.pitchers_plate}></div>
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