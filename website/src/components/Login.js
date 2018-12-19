import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      password: "",
      showPassword: false
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
      this.props.login(this.state);
    }
  };

  render() {
    return (
      <div class="signin-padding">
        <Typography variant="h5" color="inherit">
          Login
        </Typography>
        <br />
        {this.props.messsageError !== "" && (
          <Typography variant="h6" color="error">
            {this.props.messsageError}
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
          <Grid item xs={12}>
            <Button className="button-block" variant="contained" color="primary" onClick={() => this.props.login(this.state)}>
              Login
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
