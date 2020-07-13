
import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        minWidth: 550,
        maxWidth: 500
    },

});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    const onLogout = () => {
        window.localStorage.removeItem("adminData");
        window.localStorage.removeItem("uclAdminToken");
        window.location.replace("#/login");
    }
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" color="primary" className={classes.btnLogout} onClick={onLogout}>
                    Logout
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    buttonPanel: {
        marginTop: 30,
        marginBottom: 20,
        justifyContent: 'center',
        display: 'flex'
    },
    btnLogout: {
        fontSize: 14,
        textDecoration: "underline"
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const LoginMenu = props => {

    const { handleClose, open, reload } = props;
    const classes = useStyles();
    const [show, setShow] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const onFormSubmit = async e => {

        setError('');
        e.preventDefault();
        const data = new FormData(e.target);
        setIsLoading(true);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/authentication/C02Authenticate`;
        await fetch(url, { method: "POST", body: data })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                json => {
                    if (json.success === 1) {
                        window.localStorage.setItem("adminData", JSON.stringify(json));
                        window.localStorage.setItem("uclAdminToken", json.jwttoken);
                        handleClose();
                        if (reload) {
                            window.location.reload();
                        }
                    } else {
                        setError('Wrong Password');

                    }
                },
                error => {
                    setError('Wrong Password');
                    console.log(error);
                });

        setIsLoading(false);
    }
    const handleClickShowPassword = () => {
        const update = !show;
        setShow(update);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onLogout = () => {
        window.localStorage.removeItem("adminData");
        window.localStorage.removeItem("uclAdminToken");
        window.location.replace("#/login");
    }

    const { email = "" } = window.localStorage.getItem("adminData") ? JSON.parse(window.localStorage.getItem("adminData")) : {};

    return (
        <div>
            <Dialog disableScrollLock disableEscapeKeyDown disableBackdropClick open={open} onClose={handleClose} aria-labelledby="form-dialog-title">

                <DialogTitle id="customized-dialog-title">
                    Login
                </DialogTitle>
                <DialogContent>
                    <span>Your session has been expired, Please login to continue.</span>
                    <form onSubmit={e => onFormSubmit(e)} className={classes.form}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            disabled
                            value={email}
                            fullWidth
                            label="Email Address"
                        />
                        <input type="hidden" value={email} name="email" />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            onChange={() => setError('')}
                            type={show ? "text" : "password"}
                            id="password"
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {show ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>

                            }}
                        />
                        <span style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '-12px',
                            color: '#e04848'
                        }}>{error}</span>
                        <div className={classes.buttonPanel}>
                            <Button type="submit"
                                variant="contained"
                                style={{ backgroundColor: `${isLoading ? "#6272ce" : ""}`, width: '85%' }}
                                color="primary"
                                disabled={isLoading}>
                                {isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Login"}
                            </Button>
                            <span style={{
                                fontSize: 30,
                                marginLeft: 5,
                                opacity: '0.4'
                            }}>|</span>
                            <IconButton color="primary" className={classes.btnLogout} onClick={onLogout} variant="body2">
                                Logout
                                </IconButton>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
}

LoginMenu.propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.bool,
    reload: PropTypes.bool
};

LoginMenu.defaultProps = {
    handleClose: fn => fn,
    open: false,
    reload: false,
};

export default LoginMenu;