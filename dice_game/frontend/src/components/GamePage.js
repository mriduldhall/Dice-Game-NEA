import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import PauseCircleFilled from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import {Grid, Typography, Button, Card, withStyles} from "@material-ui/core";
import Dice from "./Dice";


const CherryRedTextTypography = withStyles({
  root: {
    color: "#f31a4c",
  }
})(Typography);


const PinkTextTypography = withStyles({
  root: {
    color: "#ff00ac",
  }
})(Typography);


export default function GamePage(props) {
    let [pauseStatus, setPauseStatus] = useState(false)
    let [gameSocket, setGameSocket] = useState(null)
    let [connecting, setConnecting] = useState(true)
    let [playerOneDiceValue, setPlayerOneDiceValue] = useState([6, 6]);
    let [playerTwoDiceValue, setPlayerTwoDiceValue] = useState([6, 6]);
    let [playerNumber, setPlayerNumber] = useState(null);
    let [turn, setTurn] = useState(null);
    const history = useHistory();

    useEffect(
        () => {
            setupWebsocket();
            let interval;
            interval = setInterval(validateAccess, 5000);
            return function cleanup() {
                clearInterval(interval);
            };
        },
        []
    )

    function validateAccess() {
        fetch('api/validate-access')
            .then((response) => {
                if (!response.ok) {
                    history.push('/')
                }
            })
    }

    function startGame(data) {
        setConnecting(false);
        setPlayerNumber(data.player_number);
    }

    function rollDie(data) {
        (data.dice_roller === 1) ?
            setPlayerOneDiceValue(data.dice_values) :
            setPlayerTwoDiceValue(data.dice_values)
    }

    function updateTurn(data) {
        setTurn(data.turn);
    }

    function setupWebsocket() {
        let webSocket = new WebSocket('ws://' + window.location.host + '/ws/game');
        const messageActions = {
            "/start": startGame,
            "/rolled": rollDie,
            "/turn": updateTurn,
        };
        webSocket.onmessage = (e) => {
            const message = JSON.parse(e.data);
            messageActions[message.action](message.additional_data);
        };
        setGameSocket(webSocket);
    }

    function handleExitButtonClicked() {
        gameSocket.close();
        history.push('/dashboard');
    }

    function renderPauseMenu() {
        return (
            <Grid style={{background: "transparent"}}>
                <PlayCircleFilled
                    className={"top-right"}
                    fontSize={"large"}
                    style={{fill: "white"}}
                    onClick={() => {
                        setPauseStatus(false)
                    }}
                />
                <Card className={"center"} style={{backgroundColor: "#442424", padding:10}}>
                    <CherryRedTextTypography variant={"h3"} compact={"h3"}>
                        Paused
                    </CherryRedTextTypography>
                    <Grid item xs={12} align={"center"}>
                    <Button
                        color={"secondary"}
                        variant={"contained"}
                        onClick={handleExitButtonClicked}
                    >
                        Exit Game
                    </Button>
                </Grid>
                </Card>
            </Grid>
        );
    }

    function renderPauseButton() {
        return (
            <PauseCircleFilled
                className={"top-right"}
                fontSize={"large"}
                style={{fill: "white"}}
                onClick={() => {
                    setPauseStatus(true)
                }}
            />
        );
    }

    function renderConnectingPage() {
        return (
            <div className={"center game-background"}>
                <Card className={"center"} style={{backgroundColor: "#442424", padding:10}}>
                    <CherryRedTextTypography variant={"h3"} compact={"h3"}>
                        Awaiting Second Player...
                    </CherryRedTextTypography>
                </Card>
            </div>
        );
    }

    function renderGamePage() {
        return (
            <div className={"center game-background"}>
                <div className={"center-left"}>
                    <Dice
                        diceValues={playerOneDiceValue}
                    />
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onClick={() => {
                            gameSocket.send(JSON.stringify({
                                'action': '/roll',
                                'data': {
                                    'player_number': 1
                                }
                            }));
                        }}
                        disabled={(playerNumber !== 1)}
                    >
                        Roll Die
                    </Button>
                </div>
                <div className={"center-right"}>
                    <Dice
                        diceValues={playerTwoDiceValue}
                    />
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onClick={() => {
                            gameSocket.send(JSON.stringify({
                                'action': '/roll',
                                'data': {
                                    'player_number': 2
                                }
                            }));
                        }}
                        disabled={(playerNumber === 1)}
                    >
                        Roll Die
                    </Button>
                </div>
                <div className={"center"}>
                    <PinkTextTypography variant={"h2"} compact={"h2"}>
                        Player {turn}'s Turn
                    </PinkTextTypography>
                </div>
                {
                    (pauseStatus === false) ?
                        renderPauseButton():
                        renderPauseMenu()
                }
            </div>
        );
    }

    return (
        connecting === true ?
            renderConnectingPage() :
            renderGamePage()
    );
}
