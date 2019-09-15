import React, { useState } from "react";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";

import FreeSoccerService from "../services/freesoccer";

import Register from "../components/Register";
import Login from "../components/Login";

const LoginScreen = () => {
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
    <div className="card-center">
      <Card classes={{ root: "card" }}>
        <CardContent classes={{ root: "card-content" }} className="text-center p-15">
          <Typography variant="h4" color="inherit">
            <img alt="FreeSoccer" src="/logo.png" />
          </Typography>
          <br />
          <br />
          <Grid container spacing={24}>
            <Grid item lg={6} sm={12}>
              <Login login={data => login(data)} messsageError={messsageErrorLogin} />
            </Grid>
            <Grid item lg={6} sm={12} className="line">
              <Register register={data => register(data)} messsageError={messsageErrorRegister} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
