import React, { Component } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";

import "./App.css";

import Container from "../components/Container";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={LoginScreen} />
          <Route path="/" component={Container} />
        </Switch>
      </BrowserRouter>
    );
  }
}
