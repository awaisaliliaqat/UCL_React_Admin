import Typography from '@material-ui/core/Typography';
import React from 'react';

const Copyright = (props) => {
    return (
        <Typography {...props} variant="body2" color="textSecondary" align="center">
            {`Copyright © ${new Date().getFullYear()}. University College Lahore (UCL), Pakistan - All Rights Reserved`}
        </Typography>
    );
}
export default Copyright;