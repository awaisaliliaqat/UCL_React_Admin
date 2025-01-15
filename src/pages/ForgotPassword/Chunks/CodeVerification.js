import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
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
  },
}));

const CodeVerification = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        Code Verification
          </Typography>
      <Typography component="h5" variant="body2">

      </Typography>
      <form onSubmit="" className={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="code"
          label="Code"
          name="code"
          type="number"
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Submit
            </Button>
        <Grid container justifyContent="center">
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

export default CodeVerification;