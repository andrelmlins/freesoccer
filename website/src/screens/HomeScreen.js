import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";

import { withRouter, Link } from "react-router-dom";

class HomeScreen extends Component {
  render() {
    return (
      <div>
        <Typography variant="h2" color="inherit">
          Free Soccer
        </Typography>
        <br />
        <Typography variant="h5" color="inherit">
          Free API with results from national soccer competitions
        </Typography>
        <br />
        <br />
        <Typography variant="body1" color="inherit">
          Free Soccer is an open source API.
        </Typography>
        <br />
        <br />
        <Typography variant="h6" color="inherit">
          Summary
        </Typography>
        <ul>
          <li>
            <Link to="/getting-started">Getting Started</Link>
            <ul>
              <li>
                <Link to="/getting-started#signup">Sign-Up</Link>
              </li>
              <li>
                <Link to="/getting-started#api-key">Get API key</Link>
              </li>
              <li>
                <Link to="/getting-started#knonw-api">Know the API</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/getting-started#contribute">Getting Started to Contribute</Link>
            <ul>
              <li>
                <Link to="/getting-started#clone-github">Clone to Github</Link>
              </li>
              <li>
                <Link to="/getting-started#npm">NPM</Link>
              </li>
              <li>
                <Link to="/getting-started#branch-request">Branch and Pull Request</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/documentation">Documentation</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(HomeScreen);
