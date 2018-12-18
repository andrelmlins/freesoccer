import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

class AboutScreen extends Component {
    render() {
        return (
            <div>
                <Typography variant="h2" color="inherit">
                    About us
                </Typography>
            </div>
        );
    }
}

export default withRouter(AboutScreen);