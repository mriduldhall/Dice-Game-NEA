import React from "react";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";
import GamePage from "./GamePage";
import LeaderboardPage from "./LeaderboardPage";
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {Grid, Button, ButtonGroup, Card} from "@material-ui/core";
import {CherryRedTextTypography, BrownCard} from "../styles";


export default function HomePage(props) {
    function renderHomePage() {
        return (
            <div className={"center"}>
                <BrownCard>
                    <Grid container align={"center"}>
                        <Grid item xs={12} align={"center"}>
                            <CherryRedTextTypography variant={"h3"} compact={"h3"}>
                                Dice Game
                            </CherryRedTextTypography>
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            <ButtonGroup disableElevation variant={"contained"} color={"primary"}>
                                <Button color={"primary"} to={"/login"} component={Link}>
                                    Login
                                </Button>
                                <Button color={"default"}>
                                    Info
                                </Button>
                                <Button color={"secondary"} to={"/register"} component={Link}>
                                    Register
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </BrownCard>
            </div>
        );
    }

    return (
        <Router>
            <Switch>
                <Route exact path='/' render={() => {
                    return renderHomePage()
                }}/>
                <Route path='/register' component={RegisterPage}/>
                <Route path='/login' component={LoginPage}/>
                <Route path='/dashboard' component={DashboardPage}/>
                <Route path='/game' component={GamePage}/>
                <Route path='/leaderboard' component={LeaderboardPage}/>
            </Switch>
        </Router>
    );
}
