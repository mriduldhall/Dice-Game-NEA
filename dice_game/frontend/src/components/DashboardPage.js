import React, {useEffect, useState} from "react";
import {Grid, Button, ButtonGroup} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import {CherryRedTextTypography, BrownCard, NameChip} from "../styles";


export default function DashboardPage(props) {
    const history = useHistory();
    let [gameStatus, setGameStatus] = useState(false);
    let [username, setUsername] = useState(null);

    useEffect(() => {
        validateAccess();
        getUsername();
        let interval;
        interval = setInterval(validateAccess, 300000);
        checkCurrentGameStatus();
        return function cleanup() {
            clearInterval(interval);
        };
    });

    function validateAccess() {
        fetch('api/validate-access')
            .then((response) => {
                if (!response.ok) {
                    history.push('/')
                }
            })
    }

    function getUsername() {
        fetch('api/get-username')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((data) => {
                setUsername(data.username);
            });
    }

    function checkCurrentGameStatus() {
        fetch('/api/current-game-status')
            .then((response) => {
                if (response.ok) {
                    setGameStatus(true);
                } else {
                    setGameStatus(false);
                }
            })
    }

    function handleLogoutButtonClicked() {
        fetch('api/logout')
            .then((response) => {
                if (response.ok) {
                    history.push('/')
                }
            })
    }

    function renderOngoingGameAlert() {
        return (
            <Grid item xs={12} align={"center"}>
                <Alert
                    severity={"warning"}
                >
                    You have an ongoing game
                </Alert>
            </Grid>
        );
    }

    function renderDashboardPage() {
        return (
            <div>
                <NameChip
                    className={"top-right"}
                    label={username}
                    variant={"outlined"}
                />
                <div className={"center"}>
                    <BrownCard>
                        <Grid container align={"center"}>
                            {(gameStatus === true) ? renderOngoingGameAlert() : null}
                            <Grid item xs={12} align={"center"}>
                                <CherryRedTextTypography variant={"h3"} compact={"h3"}>
                                    Dice Game
                                </CherryRedTextTypography>
                            </Grid>
                            <Grid item xs={12} align={"center"}>
                                <ButtonGroup disableElevation variant={"contained"} color={"primary"}>
                                    <Button color={"primary"} to={'/game'} component={Link}>
                                        Start Game
                                    </Button>
                                    <Button color={"default"}>
                                        Info
                                    </Button>
                                    <Button color={"default"} to={'/leaderboard'} component={Link}>
                                        Leaderboard
                                    </Button>
                                    <Button color={"secondary"} onClick={handleLogoutButtonClicked}>
                                        Logout
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </BrownCard>
                </div>
            </div>
        );
    }

    return (
        renderDashboardPage()
    );
}
