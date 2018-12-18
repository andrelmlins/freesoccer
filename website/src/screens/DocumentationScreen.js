import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

class DocumentaionScreen extends Component {
    render() {
        return (
            <div>
                <Typography variant="h2" color="inherit">
                    Documentation
                </Typography>
                <br /><br />
                <iframe src="http://www.apifreesoccer.com/docs/" title="Documentation" width="100%" height="2000" frameborder="0" scrolling="no"></iframe>
            </div>
        );
    }
}

export default withRouter(DocumentaionScreen);