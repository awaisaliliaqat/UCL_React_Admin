import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));

const EmailVerification = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [error2, setError2] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const onFormSubmit = async e => {
    setError('');
    setError2('');
    e.preventDefault();
    const data = new FormData(e.target);
    setIsLoading(true);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C02CommonUsersResetPassword`;
    await fetch(url, { method: "POST", body: data })
      .then(res => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(
        json => {
          if (json.CODE === 1) {
            setOpen(true);
          } else if (json.CODE === 4) {
            setError('The Email you provided is not associated with any account.');
            setError2('Please try again with registered email.');
          }
          else {
            alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)

          }
          console.log(json);
        },
        error => {
          console.log(error);
        });

    setIsLoading(false);
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Reset Password"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your password has been reset and sent to your registered email.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            style={{
              marginBottom: 10,
              marginRight: 10,
              awidth: 150,
              textTransform: "capitalize",
              color: "#303F9F",
              borderColor: "#303F9F",
            }}
          >
            <Link style={{ textDecoration: 'none' }} to='/login'>
              Go to Login
                          </Link>

          </Button>
        </DialogActions>
      </Dialog>
      <Typography component="h1" variant="h5">
        Forgot Password
          </Typography>
      <Typography component="h5" variant="body2">

      </Typography>
      <form onSubmit={(e) => onFormSubmit(e)} className={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
        />
        <span style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '-12px',
          color: '#e04848',
          textAlign: 'center'
        }}>{error} <br /> {error2}</span>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          {isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Submit"}
        </Button>
        <Grid container justify="center">
          <Grid item>
            <Link to="/login" variant="body2">
              {"Return to Login."}
            </Link>
          </Grid>
        </Grid>
      </form>
    </Fragment>
  );
}

export default EmailVerification;