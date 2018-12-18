import React, { Component } from 'react';
import { Route, BrowserRouter } from "react-router-dom";

import './App.css';

import routes from '../utils/routes'
import Container from '../components/Container';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <span>
          <Container>
            <main className="content">
              {
                  routes.map((item, index) => {
                    return (
                      item.showMenu && (
                        <Route exact path={item.path} component={item.component} key={index} />
                      )
                    )
                  })
              }
            </main>
          </Container>
          {
            routes.map((item, index) => {
              return (
                !item.showMenu && (
                  <Route exact path={item.path} component={item.component} key={index} />
                )
              )
            })
          }
        </span>
      </BrowserRouter>
    );
  }
}