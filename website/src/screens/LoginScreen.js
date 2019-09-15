import React, { useState } from "react";
import { Grid, Card, CardContent, withStyles } from "@material-ui/core";

import FreeSoccerService from "../services/freesoccer";

import Register from "../components/Register";
import Login from "../components/Login";

const LoginScreen = ({ classes }) => {
  const [messsageErrorLogin, setMessageErrorLogin] = useState();
  const [messsageErrorRegister, setMessageErrorRegister] = useState();

  const register = async data => {
    let result = await FreeSoccerService.register({
      username: data.username,
      password: data.password,
      email: data.email,
      name: data.name
    });

    if (result.error) {
      setMessageErrorRegister(result.message);
    } else if (!result.success) {
      setMessageErrorRegister(result.message);
    } else {
      localStorage.setItem("token", result.token);
      window.location.href = "/getting-started";
    }
  };

  const login = async data => {
    let result = await FreeSoccerService.login({
      user: data.user,
      password: data.password
    });

    if (result.error) {
      setMessageErrorLogin(result.message);
    } else if (!result.success) {
      setMessageErrorLogin(result.message);
    } else {
      localStorage.setItem("token", result.token);
      window.location.href = "/getting-started";
    }
  };

  return (
    <div className={classes.root}>
      <Card className={classes.content}>
        <CardContent>
          <img alt="FreeSoccer" src="/logo.png" className={classes.logo} />
          <Grid container spacing={4}>
            <Grid item lg={6} sm={12}>
              <Login onLogin={data => login(data)} messsageError={messsageErrorLogin} />
            </Grid>
            <Grid item lg={6} sm={12} className="line">
              <Register onRegister={data => register(data)} messsageError={messsageErrorRegister} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: "100%",
    boxSizing: "border-box",
    backgroundColor: "#2e7d32"
  },
  content: { maxWidth: "60%", textAlign: "center" },
  logo: { marginBottom: 25 }
};

export default withStyles(styles)(LoginScreen);
