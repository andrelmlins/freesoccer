import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import ScrollableAnchor, { configureAnchors } from "react-scrollable-anchor";

const GettingStartedScreen = () => {
  const [token, setToken] = useState();

  useEffect(() => {
    configureAnchors({ offset: -80, keepLastAnchorHash: true });
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <div>
      <Typography variant="h2" color="inherit">
        Getting Started
      </Typography>
      <br />
      <br />
      <ScrollableAnchor id={"signup"}>
        <Typography variant="h4">Sign-Up</Typography>
      </ScrollableAnchor>
      <br />
      <Typography variant="body1" color="inherit">
        To access the API's, it's necessary to sign-up. <br />
      </Typography>
      <br />
      {token ? (
        <Button color="primary" disabled variant="contained">
          <Icon>input</Icon>&ensp;Is Logged
        </Button>
      ) : (
        <Button color="primary" variant="contained" component={Link} to="/login">
          <Icon>input</Icon>&ensp;Login
        </Button>
      )}
      <br />
      <br />
      <ScrollableAnchor id={"api-key"}>
        <Typography variant="h4">Get API key</Typography>
      </ScrollableAnchor>
      <br />
      <Typography variant="body1" color="inherit">
        After registering you will receive a token. <br />
      </Typography>
      <Typography variant="body1" color="inherit">
        To access the endpoints, it's necessary to use your token: <br />
      </Typography>
      <code className="language-sh">{token || "Login to receive a token"}</code>
      <br />
      <ScrollableAnchor id={"know-api"}>
        <Typography variant="h4">Know the API</Typography>
      </ScrollableAnchor>
      <br />
      <code className="language-sh">
        curl -H "x-access-token: [YOUR_TOKEN];Content-Type: application/json" -X GET http://www.apifreesoccer.com/data
      </code>
      <br />
      <br />
      <ScrollableAnchor id={"contribute"}>
        <Typography variant="h2" color="inherit">
          Getting Started to Contribute
        </Typography>
      </ScrollableAnchor>
      <br />
      <br />
      <ScrollableAnchor id={"clone-github"}>
        <Typography variant="h4">Clone to Github</Typography>
      </ScrollableAnchor>
      <code className="language-sh">git clone https://github.com/andrelmlins/freesoccer</code>
      <br />
      <ScrollableAnchor id={"npm"}>
        <Typography variant="h4">NPM</Typography>
      </ScrollableAnchor>
      <br />
      <Typography variant="body1" color="inherit">
        Move to the project folder
      </Typography>
      <code className="language-sh">cd ./freesoccer</code>
      <br />
      <Typography variant="body1" color="inherit">
        Install npm dependencies
      </Typography>
      <code className="language-sh">npm install</code>
      <br />
      <Typography variant="body1" color="inherit">
        Start the Project
      </Typography>
      <code className="language-sh">npm start</code>
      <br />
      <ScrollableAnchor id={"branch-request"}>
        <Typography variant="h4">Create branch</Typography>
      </ScrollableAnchor>
      <br />
      <Typography variant="body1" color="inherit">
        Create new Branch and make your changes.
      </Typography>
      <code className="language-sh">git checkout -b new-branch</code>
    </div>
  );
};

export default GettingStartedScreen;
