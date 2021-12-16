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
            })
            .then((data) => {
                setLeaderboardData(data);
            });
    }

    function renderPersonalTableRow(row) {
        return (
            <TableRow>
                <TableCell style={{fontSize:17, color:"#2e83f1"}}><b>{row.position}</b></TableCell>
                <TableCell style={{fontSize:17, color:"#2e83f1"}}>{row.username}</TableCell>
                <TableCell style={{fontSize:17, color:"#2e83f1"}}>{row.high_score}</TableCell>
            </TableRow>
        );
    }

    function renderRegularTableRow (row, element) {
        return (
            <TableRow key={row.username}>
                <TableCell style={{fontSize:17, color:"#ffffff"}}><b>{element + 1}</b></TableCell>
                <TableCell style={{fontSize:17, color:"#ffffff"}}>{row.username}</TableCell>
                <TableCell style={{fontSize:17, color:"#ffffff"}}>{row.high_score}</TableCell>
            </TableRow>
        );
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
                            {leaderboardData.leaderboard.map((row, element) => (
                                (leaderboardData.personal.position !== element + 1) ? renderRegularTableRow(row, element) : renderPersonalTableRow(leaderboardData.personal)
                            ))}
                            {(leaderboardData.personal.position > leaderboardData.leaderboard.length) ? renderPersonalTableRow(leaderboardData.personal) : null}
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
