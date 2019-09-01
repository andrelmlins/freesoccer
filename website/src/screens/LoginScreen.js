import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import FreeSoccerService from '../services/freesoccer';

import Register from '../components/Register';
import Login from '../components/Login';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messsageErrorLogin: '',
      messsageErrorRegister: ''
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  onEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.register();
    }
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  register = async data => {
    let result = await FreeSoccerService.register({
      username: data.username,
      password: data.password,
      email: data.email,
      name: data.name
    });

    if (result.error) {
      this.setState({ messsageErrorRegister: result.message });
    } else {
      localStorage.setItem('token', result.token);
      window.location.href = '/getting-started';
    }
  };

  login = async data => {
    let result = await FreeSoccerService.login({
      user: data.user,
      password: data.password
    });

    if (result.error) {
      this.setState({ messsageErrorLogin: result.message });
    } else if (!result.success) {
      this.setState({ messsageErrorLogin: result.message });
    } else {
      localStorage.setItem('token', result.token);
      window.location.href = '/getting-started';
    }
  };

  render() {
    return (
      <div className="card-center">
        <Card classes={{ root: 'card' }}>
          <CardContent classes={{ root: 'card-content' }} className="text-center p-15">
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
            <Grid container spacing={24}>
              <Grid item lg={6} sm={12}>
                <Login login={this.login} messsageError={this.state.messsageErrorLogin} />
              </Grid>
              <Grid item lg={6} sm={12} className="line">
                <Register register={this.register} messsageError={this.state.messsageErrorRegister} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withRouter(LoginScreen);
