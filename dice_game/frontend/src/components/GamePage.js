import React, {useState} from "react";
import {Link} from "react-router-dom";
import PauseCircleFilled from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import {Grid, Typography, Button, Card, withStyles} from "@material-ui/core";


const CherryRedTextTypography = withStyles({
  root: {
    color: "#f31a4c",
  }
})(Typography);


export default function GamePage(props) {
    let [pauseStatus, setPauseStatus] = useState(false)

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
                        to={"/dashboard"}
                        component={Link}
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

    function renderGamePage() {
        return (
            <div className={"center game-background"}>
                {
                    (pauseStatus === false) ?
                        renderPauseButton():
                        renderPauseMenu()
                }
            </div>
        );
    }

    return (
        renderGamePage()
    );
}
