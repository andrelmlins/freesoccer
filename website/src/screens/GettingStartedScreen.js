import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

import { withRouter } from 'react-router-dom';

class GettingStartedScreen extends Component {
    render() {
        return (
            <div>
                <Typography variant="h2" color="inherit">
                    Getting Started
                </Typography>
                <br /><br />
                <Typography variant="h4">
                    Sign-Up
                </Typography>
                <br />
                <Typography variant="body" color="inherit">
                    To access the API's, it's necessary to  sign-up. <br />
                </Typography>
                <br /><br />
                <Typography variant="h4">
                    Get API key
                </Typography>
                <br />
                <Typography variant="body" color="inherit">
                    After registering you will receive a token. <br />
                </Typography>
                <br /><br />
                <Typography variant="h4">
                    Know the API
                </Typography>
                <br /><br /><br />
                <Typography variant="h2" color="inherit">
                    Getting Started to Contribute
                </Typography>
                <br /><br />
                <Typography variant="h4">
                    Clone to Github
                </Typography>
                <code class="language-sh">
                    git clone https://github.com/andrelmlins/freesoccer
                </code>
                <br />
                <Typography variant="h4">
                   NPM
                </Typography>
                <br />
                <Typography variant="body" color="inherit">
                    Move to the project folder
                </Typography>
                <code class="language-sh">
                    cd ./freesoccer
                </code>
                <br />
                <Typography variant="body" color="inherit">
                    Install npm dependencies
                </Typography>
                <code class="language-sh">
                    npm install
                </code>
                <br />
                <Typography variant="body" color="inherit">
                    Start the Project
                </Typography>
                <code class="language-sh">
                    npm start
                </code>
                <br />
                <Typography variant="h4">
                   Create branch
                </Typography>
                <br />
                <Typography variant="body" color="inherit">
                    Create new Branch and make your changes.
                </Typography>
                <code class="language-sh">
                    git checkout -b new-branch
                </code>
            </div>
        );
    }
}

export default withRouter(GettingStartedScreen);