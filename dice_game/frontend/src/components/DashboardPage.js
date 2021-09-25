import React, {useEffect} from "react";
import {Grid, Typography, Button, ButtonGroup, Card, withStyles} from "@material-ui/core";
import { useHistory } from 'react-router-dom';


const CherryRedTextTypography = withStyles({
  root: {
    color: "#f31a4c",
  }
})(Typography);


export default function DashboardPage(props) {
    const history = useHistory();


    useEffect(() => {
        validateAccess();
        let interval;
        interval = setInterval(validateAccess, 300000);
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


    function handleLogoutButtonClicked() {
        fetch('api/logout')
            .then((response) => {
                if (response.ok) {
                    history.push('/')
                }
            })
    }


    function renderDashboardPage() {
        return (
            <div className={"center"}>
                <Card style={{backgroundColor: "#442424", padding:10}}>
                    <Grid container align={"center"}>
                        <Grid item xs={12} align={"center"}>
                            <CherryRedTextTypography variant={"h3"} compact={"h3"}>
                                Dice Game
                            </CherryRedTextTypography>
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            <ButtonGroup disableElevation variant={"contained"} color={"primary"}>
                                <Button color={"primary"}>
                                    Start Game
                                </Button>
                                <Button color={"default"}>
                                    Info
                                </Button>
                                <Button color={"default"}>
                                    Leaderboard
                                </Button>
                                <Button color={"secondary"} onClick={handleLogoutButtonClicked}>
                                    Logout
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Card>
            </div>
        );
    }

    return (
        renderDashboardPage()
    );
}
