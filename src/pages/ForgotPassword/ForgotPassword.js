import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Copyright from '../../components/Copyrights/copyrights';
import Background from '../../assets/Images/background.jpg';
import Logo from '../../assets/Images/logo.png';
import NavBar from '../../components/NavBar/NavBar';
import EmailVerification from './Chunks/EmailVerification';
import CodeVerification from './Chunks/CodeVerification';
import ChangePassword from './Chunks/ChangePassword';
import { Hidden } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '97vh',
    },
    image: {
        backgroundImage: `url(${Background})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: "100vh"
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
    },
    paper: {
        margin: theme.spacing(2, 2),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin:`auto ${theme.spacing(2)}px`
    },
}));

const ForgotPassword = () => {
    const classes = useStyles();
    // eslint-disable-next-line no-unused-vars
    const [viewValue, setViewValue] = useState(0);

    return (
        <Grid container component="main" className={classes.root}>
            <NavBar logo={Logo} />
            <CssBaseline />
            <Grid container justifyContent='center' alignItems='stretch'>
                <Hidden smDown><Grid item md={7} className={classes.image} /></Hidden>
                <Grid item xs={12} sm={11} md={5} component={Paper} elevation={6} square>
                    <div className={classes.container}>
                        <div className={classes.paper}>
                            {viewValue === 0 && <EmailVerification />}
                            {viewValue === 1 && <CodeVerification />}
                            {viewValue === 2 && <ChangePassword />}
                        </div>
                        <div style={{ paddingBottom: 25 }}>
                            <Copyright />
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ForgotPassword;