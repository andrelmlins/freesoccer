import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const Login = ({ onLogin, messsageError }) => {
  const [fields, setFields] = useState({ user: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = newFields => {
    setFields({ ...fields, ...newFields });
  };

  const onEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      onLogin(fields);
    }
  };

  return (
    <div>
      <Typography variant="h5" color="inherit">
        Login
      </Typography>
      <br />
      {messsageError !== "" && (
        <Typography variant="body1" color="error">
          {messsageError}
        </Typography>
      )}
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <TextField
            id="outlined-email-login"
            label="Email or Username"
            autoComplete="email"
            className="input-block"
            value={fields.user}
            onChange={e => handleChange({ user: e.target.value })}
            margin="normal"
            variant="outlined"
            onKeyDown={e => onEnterPress(e)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-password-login"
            label="Password"
            type={showPassword ? "text" : "password"}
            className="input-block"
            value={fields.password}
            onChange={e => handleChange({ password: e.target.value })}
            margin="normal"
            variant="outlined"
            onKeyDown={e => onEnterPress(e)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button className="button-block" variant="contained" color="primary" onClick={() => onLogin(fields)}>
            Login
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
