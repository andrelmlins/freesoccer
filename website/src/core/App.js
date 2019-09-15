import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";

import "./App.css";

import Container from "../components/Container";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={LoginScreen} />
      <Route path="/" component={Container} />
    </Switch>
  </BrowserRouter>
);

export default App;
