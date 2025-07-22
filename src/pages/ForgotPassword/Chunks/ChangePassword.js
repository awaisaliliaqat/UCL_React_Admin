import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
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

export default function ChangePassword() {
  const classes = useStyles();
  const [showNP, setShowNP] = React.useState(false);
  const [showCP, setShowCP] = React.useState(false);

  const handleClickShowNPassword = () => {
    const update = !showNP;
    setShowNP(update);
  };

  const handleClickShowCPassword = () => {
    const update = !showCP;
    setShowCP(update);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        Passwords
          </Typography>
      <Typography component="h5" variant="body2">

      </Typography>
      <form onSubmit="" className={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="newPassword"
          label="New Password"
          name="newPassword"
          type={showNP ? "text" : "password"}
          autoFocus
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowNPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showNP ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>

          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type={showCP ? "text" : "password"}
          id="confirmPassword"
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowCPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showCP ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>

          }}
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