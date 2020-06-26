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

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(${Background})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
        alignItems: 'center',
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
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{ marginTop: 55 }}>
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
    );
}

export default ForgotPassword;