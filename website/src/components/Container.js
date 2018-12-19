import React, { Component } from "react";
import { BrowserRouter, Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import routes from "../utils/routes";

export default class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileOpen: false
    };
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const drawer = (
      <div>
        <Hidden xsDown implementation="css">
          <List>
            {routes.map((item, index) => {
              return (
                item.showMenu && (
                  <ListItem component={Link} button key={index} to={item.path}>
                    <ListItemIcon>
                      <Icon>{item.icon}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItem>
                )
              );
            })}
          </List>
        </Hidden>
        <Hidden smUp implementation="css">
          <List>
            {routes.map((item, index) => {
              return (
                <ListItem component={Link} button key={index} to={item.path} onClick={this.handleDrawerToggle}>
                  <ListItemIcon>
                    <Icon>{item.icon}</Icon>
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              );
            })}
          </List>
        </Hidden>
      </div>
    );

    return (
      <BrowserRouter>
        {!(window.location.pathname === "/login" || window.location.pathname === "/register") && (
          <div className="container">
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: "drawer"
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden smUp implementation="css">
              <Drawer
                container={this.props.container}
                variant="temporary"
                anchor={"left"}
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <AppBar position="fixed" className="header">
              <Toolbar>
                <Hidden smUp implementation="css">
                  <IconButton color="inherit" aria-label="Open drawer" onClick={this.handleDrawerToggle}>
                    <MenuIcon />
                  </IconButton>
                </Hidden>
                <Typography variant="title" color="inherit" noWrap>
                  <span role="img" aria-label="icon">
                    ⚽️
                  </span>{" "}
                  Free Soccer{" "}
                  <span role="img" aria-label="icon">
                    ⚽️
                  </span>
                </Typography>
                <div className="grow" />
                <Hidden xsDown implementation="css">
                  <Button color="inherit" component="a" href="/login">
                    <Icon>input</Icon>&ensp;Login
                  </Button>
                </Hidden>
              </Toolbar>
            </AppBar>
            {this.props.children}
          </div>
        )}
      </BrowserRouter>
    );
  }
}
