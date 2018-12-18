import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

import { withRouter } from 'react-router-dom';

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
                <br /><br />
                <Typography variant="body1" color="inherit">
                    Free Soccer is an open source API.
                </Typography>
            </div>
        );
    }
}

export default withRouter(HomeScreen);