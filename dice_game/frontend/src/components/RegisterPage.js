import React, {useState} from "react";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Lock from "@material-ui/icons/Lock";
import { Link } from "react-router-dom";
import {Box, Grid, Typography, FormControl, Button, Collapse, TextField, Card, withStyles} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";


const CherryRedTextTypography = withStyles({
  root: {
    color: "#f31a4c",
  }
})(Typography);


export default function RegisterPage(props) {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [errorMsg, setErrorMsg] = useState("");

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleRegisterButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password,
            })
        };
        fetch('/api/register', requestOptions)
            .then((response) => {
                if (response.ok) {
                    props.history.push('/');
                } else {
                    setErrorMsg("Username Already In Use!");
                }
            })
    }

    function renderRegisterPage() {
        return(
            <div className={"center"}>
                <Card style={{backgroundColor: "#442424", padding:10}}>
                    <Collapse in={errorMsg !== ""}>
                        <Alert
                            severity={"error"}
                            onClose={() => {
                                setErrorMsg("");
                            }}
                        >
                            {errorMsg}
                        </Alert>
                    </Collapse>
                    <Grid container align={"center"} spacing={1}>
                        <Grid item xs={12} align={"center"}>
                            <CherryRedTextTypography component={'h4'} variant={'h4'}>
                                Register
                            </CherryRedTextTypography>
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            <FormControl component={"fieldset"}>
                                <Box sx={{display:'flex', alignItems: 'flex-end'}}>
                                    <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }}/>
                                    <TextField
                                        id="input-username"
                                        label="Username"
                                        variant="standard"
                                        required
                                        onChange={handleUsernameChange}
                                        InputProps={{style: { color: '#ffffff' }}}
                                        InputLabelProps={{style: { color: '#ffffff' }}}
                                    />
                                </Box>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} align={"center"}>
                            <FormControl component={"fieldset"}>
                                <Box sx={{display:'flex', alignItems: 'flex-end'}}>
                                    <Lock sx={{ color: 'action.active', mr: 1, my: 0.5 }}/>
                                    <TextField
                                        id="input-password"
                                        label="Password"
                                        variant="standard"
                                        type={"password"}
                                        onChange={handlePasswordChange}
                                        required
                                        InputProps={{style: { color: '#ffffff' }}}
                                        InputLabelProps={{style: { color: '#ffffff' }}}
                                    />
                                </Box>
                            </FormControl>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} align={"center"}>
                                <Button color={"primary"} variant={"contained"} disabled={!username || !password} onClick={handleRegisterButtonPressed}>
                                    Register
                                </Button>
                            </Grid>
                            <Grid item xs={12} align={"center"}>
                                <Button color={"secondary"} variant={"contained"} to={"/"} component={Link}>
                                    Back
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </div>
        );
    }

    return (
        renderRegisterPage()
    );
}
