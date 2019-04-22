import React, { Component } from "react";
import SwaggerUI from "swagger-ui";

import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

class DocumentaionScreen extends Component {
  componentDidMount() {
    SwaggerUI({
      dom_id: "#ui",
      url: window.location.origin
    });
  }

  render() {
    return (
      <div>
        <Typography variant="h2" color="inherit" noWrap>
          Documentation
        </Typography>
        <br />
        <div id="ui" />
      </div>
    );
  }
}

export default withRouter(DocumentaionScreen);
