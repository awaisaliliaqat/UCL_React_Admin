import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

const ChangePasswordMenu = props => {

    const { handleClose, open } = props;

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
        <div>
            <Dialog disableBackdropClick open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', padding: 20 }}>
                    <Button variant="contained" onClick={handleClose} color="primary">
                        Submit
          </Button>
                    <Button variant="outlined" onClick={handleClose} color="primary">
                        Cancel
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

ChangePasswordMenu.propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.bool
};

ChangePasswordMenu.defaultProps = {
    handleClose: fn => fn,
    open: false
};

export default ChangePasswordMenu;