import React from "react";
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
                <Card style={{backgroundColor: "darkgray", padding:10}}>
                    <Grid container align={"center"}>
                        <Grid item xs={12} align={"center"}>
                            <CherryRedTextTypography variant={"h3"} compact={"h3"}>
                                Dice Game
                            </CherryRedTextTypography>
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            <ButtonGroup disableElevation variant={"contained"} color={"primary"}>
                                <Button color={"primary"}>
                                    Login
                                </Button>
                                <Button color={"default"}>
                                    Info
                                </Button>
                                <Button color={"secondary"}>
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
        renderHomePage()
    );
}
