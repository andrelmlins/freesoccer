import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const Register = ({ onRegister, messsageError }) => {
  const [fields, setFields] = useState({ name: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState();

  const handleChange = newFields => {
    setFields({ ...fields, ...newFields });
  };

  const onEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      onRegister(fields);
    }
  };

  return (
    <div>
      <Typography variant="h5" color="inherit">
        Register
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
            id="outlined-name-register"
            label="Name"
            className="input-block"
            value={fields.name}
            onChange={e => handleChange({ name: e.target.value })}
            margin="normal"
            variant="outlined"
            onKeyDown={e => onEnterPress(e)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-username-register"
            label="Username"
            className="input-block"
            value={fields.username}
            onChange={e => handleChange({ username: e.target.value })}
            margin="normal"
            variant="outlined"
            onKeyDown={e => onEnterPress(e)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-email-register"
            label="Email"
            type="email"
            className="input-block"
            value={fields.email}
            onChange={e => handleChange({ email: e.target.value })}
            margin="normal"
            variant="outlined"
            onKeyDown={e => onEnterPress(e)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-password-register"
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
          <Button className="button-block" variant="contained" color="primary" onClick={() => onRegister(fields)}>
            Register
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Register;
