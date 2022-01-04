import React, {useState, useEffect} from "react";
import {Grid, Button, ButtonGroup, TableContainer, Table, TableHead, TableRow, TableBody, TableCell} from "@material-ui/core";
import {Link} from "react-router-dom";
import {CherryRedTextTypography, BrownCard, LeaderboardBlueTableCell, LeaderboardWhiteTableCell, LeaderboardHeadingTableCell} from "../styles";


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
                <LeaderboardBlueTableCell><b>{row.position}</b></LeaderboardBlueTableCell>
                <LeaderboardBlueTableCell>{row.username}</LeaderboardBlueTableCell>
                <LeaderboardBlueTableCell>{row.high_score}</LeaderboardBlueTableCell>
            </TableRow>
        );
    }

    function renderRegularTableRow (row, element) {
        return (
            <TableRow key={row.username}>
                <LeaderboardWhiteTableCell><b>{element + 1}</b></LeaderboardWhiteTableCell>
                <LeaderboardWhiteTableCell>{row.username}</LeaderboardWhiteTableCell>
                <LeaderboardWhiteTableCell>{row.high_score}</LeaderboardWhiteTableCell>
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
                                <LeaderboardHeadingTableCell>Username</LeaderboardHeadingTableCell>
                                <LeaderboardHeadingTableCell>Score</LeaderboardHeadingTableCell>
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
            <BrownCard>
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
            </BrownCard>Z
        </div>
    );
}
