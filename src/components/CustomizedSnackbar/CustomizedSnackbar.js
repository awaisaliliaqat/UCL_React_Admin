import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function CustomizedSnackbar({handleCloseSnackbar, isOpen, severity, message}) {

  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Snackbar 
        open={isOpen} 
        autoHideDuration={2000} 
        onClose={handleCloseSnackbar}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled"
          onClose={handleCloseSnackbar} 
          severity={severity}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

CustomizedSnackbar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleCloseSnackbar: PropTypes.func.isRequired,
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success', '']).isRequired,
  message: PropTypes.string.isRequired,
};

CustomizedSnackbar.defaultProps = {
  isOpen: false,
  severity: 'info',
  message: '',
};

export default CustomizedSnackbar;