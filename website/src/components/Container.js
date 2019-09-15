import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Route, Switch, Link } from "react-router-dom";

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

const Container = ({ container }) => {
  const classes = useStyle();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          {routes.map((item, index) => (
            <ListItem component={Link} button key={index} to={item.path} onClick={() => setMobileOpen(false)}>
              <ListItemIcon>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Hidden>
    </div>
  );

  return (
    <div className="container">
      <Hidden xsDown implementation="css">
        <Drawer classes={{ paper: classes.drawer }} variant="permanent" open>
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={"left"}
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <AppBar position="fixed" className="header">
        <Toolbar>
          <Hidden smUp implementation="css">
            <IconButton color="inherit" aria-label="Open drawer" onClick={() => setMobileOpen(!mobileOpen)}>
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
          <div style={{ flexGrow: 1 }} />
          <Hidden xsDown implementation="css">
            <Button color="inherit" component={Link} to="/login">
              <Icon>input</Icon>&ensp;Login
            </Button>
          </Hidden>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <Switch>
          {routes.map((item, index) => (
            <Route exact path={item.path} component={item.component} key={index} />
          ))}
        </Switch>
      </main>
    </div>
  );
};

const useStyle = makeStyles(theme => ({
  content: {
    padding: 40,
    paddingTop: 104,
    marginLeft: 240,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    }
  },
  drawer: { paddingTop: 64 }
}));

export default Container;
