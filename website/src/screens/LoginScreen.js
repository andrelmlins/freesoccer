import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { withRouter } from "react-router-dom";
import FreeSoccerService from "../services/freesoccer";

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      password: "",
      showPassword: false,
      messsageError: ""
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  onEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.login();
    }
  };

  login = async () => {
    let result = await FreeSoccerService.login({
      user: this.state.user,
      password: this.state.password
    });

    if (result.error) {
      this.setState({ messsageError: result.message });
    } else {
      // TODO
    }
  };

  render() {
    return (
      <div className="card-center">
        <form onSubmit={this.login}>
          <Card classes={{ root: "card" }}>
            <CardContent classes={{ root: "card-content" }} className="text-center p-15">
              <Typography variant="h4" color="inherit">
                <span role="img" aria-label="icon">
                  ⚽️
                </span>
                Free Soccer
                <span role="img" aria-label="icon">
                  ⚽️
                </span>
              </Typography>
              <br />
              <br />
              {this.state.messsageError !== "" && (
                <Typography variant="h6" color="error">
                  {this.state.messsageError}
                </Typography>
              )}
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-email"
                    label="Email or Username"
                    type="user"
                    autoComplete="email"
                    className="input-block"
                    value={this.state.user}
                    onChange={this.handleChange("user")}
                    margin="normal"
                    variant="outlined"
                    onKeyDown={this.onEnterPress}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-password"
                    label="Password"
                    type={this.state.showPassword ? "text" : "password"}
                    className="input-block"
                    value={this.state.password}
                    onChange={this.handleChange("password")}
                    margin="normal"
                    variant="outlined"
                    onKeyDown={this.onEnterPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions classes={{ root: "card-actions" }}>
              <Button className="button-block" variant="contained" color="primary" onClick={this.login}>
                Login
              </Button>
            </CardActions>
          </Card>
        </form>
      </div>
    );
  }
}

export default withRouter(LoginScreen);
