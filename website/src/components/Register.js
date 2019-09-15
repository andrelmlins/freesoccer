import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      username: "",
      email: "",
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
      this.props.register(this.state);
    }
  };

  render() {
    return (
      <div>
        <Typography variant="h5" color="inherit">
          Register
        </Typography>
        <br />
        {this.props.messsageError !== "" && (
          <Typography variant="body1" color="error">
            {this.props.messsageError}
          </Typography>
        )}
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TextField
              id="outlined-name-register"
              label="Name"
              type="name"
              autoComplete="name"
              className="input-block"
              value={this.state.name}
              onChange={this.handleChange("name")}
              margin="normal"
              variant="outlined"
              onKeyDown={this.onEnterPress}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-username-register"
              label="Username"
              type="username"
              autoComplete="username"
              className="input-block"
              value={this.state.username}
              onChange={this.handleChange("username")}
              margin="normal"
              variant="outlined"
              onKeyDown={this.onEnterPress}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-email-register"
              label="Email"
              type="email"
              autoComplete="email"
              className="input-block"
              value={this.state.email}
              onChange={this.handleChange("email")}
              margin="normal"
              variant="outlined"
              onKeyDown={this.onEnterPress}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-password-register"
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
            <Button className="button-block" variant="contained" color="primary" onClick={() => this.props.register(this.state)}>
              Register
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
