import React, { Fragment } from 'react';
import PropTypes from "prop-types";
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import BG from '../../../assets/Images/bg.png';

const WelcomePage = props => {
    const { title } = props;

    return (
        <Fragment>
            <div style={{
                backgroundImage: `url(${BG})`,
                backgroundSize: 'cover',
                backgroundpPosition: 'center',
                position: 'fixed',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '100%',
                margin: '-10px'
            }}>

            </div>
            <div style={{
                padding: 20
            }}>
                <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                    Welcome {title}
                </Typography>
                <Divider style={{
                    backgroundColor: 'rgb(58, 127, 187)',
                    opacity: '0.3',
                    width: '100%'
                }} />



            </div>
        </Fragment>
    );
}
WelcomePage.propTypes = {
    title: PropTypes.string,
};

WelcomePage.defaultProps = {
    title: "to UCL"
};

export default WelcomePage;