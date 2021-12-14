import React, {useState, useEffect} from "react";
import {Grid, Card, Typography, Button, ButtonGroup, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";


const CherryRedTextTypography = withStyles({
  root: {
    color: "#f31a4c",
  }
})(Typography);


export default function LeaderboardPage(props) {
    const [leaderboardData, setLeaderboardData] = useState(null);

    useEffect(
        () => {
            getLeaderboardData();
        },
        []
    );

    function getLeaderboardData() {
        fetch('/api/leaderboard')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    console.log("Error")
                }
            })
            .then((data) => {
                console.log(data);
                setLeaderboardData(data);
            });
    }

    function renderLeaderboardTable() {
        return (
            <Grid item xs={12} align={"center"}>
                <TableContainer style={{ maxHeight: 400 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                <TableCell style={{fontSize:35, color:"#2e83f1"}}>Username</TableCell>
                                <TableCell style={{fontSize:35, color:"#2e83f1"}}>Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaderboardData.map((row, element) => (
                                <TableRow key={row.username}>
                                    <TableCell style={{fontSize:17, color:"#ffffff"}}><b>{element + 1}</b></TableCell>
                                    <TableCell style={{fontSize:17, color:"#ffffff"}}>{row.username}</TableCell>
                                    <TableCell style={{fontSize:17, color:"#ffffff"}}>{row.high_score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        );
    }

    return (
        <div className={"center"}>
            <Card style={{backgroundColor: "#442424", padding:20, maxHeight:500}}>
                <Grid container align={"center"} spacing={1}>
                    <Grid item xs={12} align={"center"}>
                        <CherryRedTextTypography variant={"h3"} compact={"h3"}>
                            Leaderboard
                        </CherryRedTextTypography>
                    </Grid>
                    {(leaderboardData !== null) ? renderLeaderboardTable() : null}
                    <Grid item xs={12} align={"center"}>
                        <ButtonGroup disableElevation variant={"contained"} color={"primary"}>
                            <Button color={"primary"} to={'/dashboard'} component={Link}>
                                Back
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Card>
        </div>
    );
}
