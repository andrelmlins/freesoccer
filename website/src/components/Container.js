import React, { Component } from 'react';
import { BrowserRouter, Link } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import routes from '../utils/routes'

export default class Container extends Component {
  render() {
    const drawer = (
      <div>
        <List>
          {
            routes.map((item, index) => {
              return (
                item.showMenu && (
                    <ListItem component={Link} button key={index} to={item.path}>
                        <ListItemIcon><Icon>{item.icon}</Icon></ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItem>
                )
              )
            })
          }
        </List>
      </div>
    );

    return (
      <BrowserRouter>
        {
            !(window.location.pathname==="/login" || window.location.pathname==="/register") && (
                <div className="container">
                    <Drawer
                        classes={{
                            paper: "drawer",
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                    <AppBar position="fixed" className="header">
                        <Toolbar>
                            <Typography variant="title" color="inherit" noWrap>
                                <span role="img" aria-label="icon">⚽️</span> Free Soccer <span role="img" aria-label="icon">⚽️</span>
                            </Typography>
                            <div className="grow" />
                            <Button color="inherit" component="a" href="/login">Login</Button>
                            <Button color="inherit" component="a" href="/register">Register</Button>
                        </Toolbar>
                    </AppBar>
                    {this.props.children}
                </div>
            )
        }
      </BrowserRouter>
    );
  }
}