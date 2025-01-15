import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox'; 
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Copyright from '../../components/Copyrights/copyrights';
import Background from '../../assets/Images/background.jpg';
import Logo from '../../assets/Images/logo.png';
import NavBar from '../../components/NavBar/NavBar';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';

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
  paper: {
    margin: theme.spacing(2, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
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

export default function SetPassword() {
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
    <Grid container component="main" className={classes.root}>
      <NavBar logo={Logo} title="University College London" />
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{ marginTop: 55 }}>
        <div className={classes.paper}>
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
            <Grid container  justifyContent="center">
              <Grid item>
                <Link to="/login" variant="body2">
                  {"Return to Login."}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}