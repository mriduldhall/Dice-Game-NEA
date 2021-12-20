import React, {useState, useEffect, useRef} from "react";
import { useHistory } from 'react-router-dom';
import PauseCircleFilled from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import {Grid, Typography, Button, Avatar, Card, withStyles} from "@material-ui/core";
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
    const gameSocket = useRef(null);
    let [connecting, setConnecting] = useState(true)
    let [playerOneDiceValue, setPlayerOneDiceValue] = useState([6, 6]);
    let [playerTwoDiceValue, setPlayerTwoDiceValue] = useState([6, 6]);
    let [playerNumber, setPlayerNumber] = useState(null);
    let [turn, setTurn] = useState(null);
    let [round, setRound] = useState(null);
    let [playerOneScore, setPlayerOneScore] = useState(0);
    let [playerTwoScore, setPlayerTwoScore] = useState(0);
    let [winner, setWinner] = useState(null);
    let [tempData, setTempData] = useState(null);
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
        setTempData(data);
        if (data.dice_roller === 1) {
            setPlayerOneDiceValue(data.dice_values);
        } else {
            setPlayerTwoDiceValue(data.dice_values);
        }
    }

    function updateTurn(data) {
        setTurn(data.turn);
        setRound(data.round);
    }

    function diceRolled() {
        if (tempData.dice_roller === 1) {
            setPlayerOneScore(tempData.score);
        } else {
            setPlayerTwoScore(tempData.score);
        }
        setTempData(null);
        gameSocket.current.send(JSON.stringify({
            'action': '/next',
            'data': {}
        }));
    }

    function updateGame(data) {
        setConnecting(false);
        setPlayerNumber(data.player_number);
        setTurn(data.turn);
        setRound(data.round);
        setPlayerOneScore(data.player_one_score);
        setPlayerTwoScore(data.player_two_score);
        if (data.winner !== null) {
            setWinner(data.winner);
        }
    }

    function endGame(data) {
        setWinner(data.winner);
    }

    function setupWebsocket() {
        gameSocket.current = new WebSocket('ws://' + window.location.host + '/ws/game');
        const messageActions = {
            "/start": startGame,
            "/rolled": rollDie,
            "/turn": updateTurn,
            "/end": endGame,
            "/update": updateGame,
        };
        gameSocket.current.onmessage = (e) => {
            const message = JSON.parse(e.data);
            messageActions[message.action](message.additional_data);
        };
    }

    function handleExitButtonClicked() {
        gameSocket.current.send(JSON.stringify({
            'action': '/leave',
            'data': {}
        }));
        gameSocket.current.close();
        history.push('/dashboard');
    }

    function handleCancelButtonClicked() {
        gameSocket.current.send(JSON.stringify({
            'action': '/cancel',
            'data': {}
        }));
        gameSocket.current.close();
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

    function renderEndPage() {
        return (
            <div className={"center game-background"}>
                <Card className={"center"} style={{backgroundColor: "#442424", padding:10}}>
                    <CherryRedTextTypography variant={"h3"} compact={"h3"}>
                        Winner: Player {winner}
                    </CherryRedTextTypography>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onClick={handleExitButtonClicked}
                    >
                        Return to Main Menu
                    </Button>
                </Card>
            </div>
        );
    }

    function renderConnectingPage() {
        return (
            <div className={"center game-background"}>
                <Card className={"center"} style={{backgroundColor: "#442424", padding:10}}>
                    <CherryRedTextTypography variant={"h3"} compact={"h3"}>
                        Awaiting Second Player...
                    </CherryRedTextTypography>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onClick={handleCancelButtonClicked}
                    >
                        Cancel
                    </Button>
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
                        rollDoneCallback={diceRolled}
                    />
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onClick={() => {
                            gameSocket.current.send(JSON.stringify({
                                'action': '/roll',
                                'data': {
                                    'player_number': playerNumber
                                }
                            }));
                        }}
                        disabled={(playerNumber !== 1)}
                    >
                        Roll Die
                    </Button>
                    <Avatar
                        style={{backgroundColor: "#000000"}}
                        className={"score-positioning"}
                    >
                        {playerOneScore}
                    </Avatar>
                </div>
                <div className={"center-right"}>
                    <Dice
                        diceValues={playerTwoDiceValue}
                        rollDoneCallback={diceRolled}
                    />
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onClick={() => {
                            gameSocket.current.send(JSON.stringify({
                                'action': '/roll',
                                'data': {
                                    'player_number': playerNumber
                                }
                            }));
                        }}
                        disabled={(playerNumber === 1)}
                    >
                        Roll Die
                    </Button>
                    <Avatar
                        style={{backgroundColor: "#000000"}}
                        className={"score-positioning"}
                    >
                        {playerTwoScore}
                    </Avatar>
                </div>
                <div className={"center-text"}>
                    <PinkTextTypography variant={"h2"} compact={"h2"}>
                        Player {turn}'s Turn
                    </PinkTextTypography>
                    <PinkTextTypography variant={"h4"} compact={"h4"}>
                        Round {round}
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
            winner !== null ?
                renderEndPage() :
                renderGamePage()
    );
}
