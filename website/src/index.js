import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./core/App";
import * as serviceWorker from "./serviceWorker";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#2E7D32",
      main: "#2E7D32",
      dark: "#2E7D32",
      contrastText: "#fff"
    }
  },
  zIndex: {
    mobileStepper: 1000,
    appBar: 1200,
    gaveta: 1100,
    modal: 1300,
    snackbar: 1400,
    Sugestão: 1500
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
