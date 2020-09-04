import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
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
    justifyContent: 'space-between',
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
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  }
}));

const Login = () => {
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
            window.localStorage.setItem("isViewDialog", 0);
            window.localStorage.setItem("userTypeId", json.userTypeId);
            window.location.replace("#/dashboard");
          } else {
            setError('Invalid Email or Password');
          }
        },
        error => {
          setError('Invalid Email or Password');
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


  return (
    <Fragment>
      <Grid container component="main" className={classes.root}>
        <NavBar logo={Logo} title="University College London" />
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} justify="space-between" component={Paper} elevation={6} square style={{ marginTop: 55 }}>
          <div className={classes.container}>
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                Login
          </Typography>
              <Typography component="h5" variant="body2">

              </Typography>
              <form onSubmit={e => onFormSubmit(e)} className={classes.form}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  onChange={() => setError('')}
                  autoComplete="email"
                  autoFocus
                />
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  style={{ backgroundColor: `${isLoading ? "#6272ce" : ""}` }}
                  color="primary"
                  className={classes.submit}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Login"}
                </Button>
                <Grid container>
                  <Grid style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }} item xs>
                    <Link to="/forgot-password" variant="body2">
                      Forgot password?
                </Link>
                  </Grid>
                </Grid>
              </form>
            </div>
            <div style={{ paddingBottom: 25 }}>
              <Copyright />
            </div>
          </div>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default Login;