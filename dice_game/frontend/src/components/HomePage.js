import React from "react";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {Grid, Typography, Button, ButtonGroup, Card, withStyles} from "@material-ui/core";


const CherryRedTextTypography = withStyles({
  root: {
    color: "#f31a4c",
  }
})(Typography);


export default function HomePage(props) {
    function renderHomePage() {
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
                </Card>
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
            </Switch>
        </Router>
    );
}
