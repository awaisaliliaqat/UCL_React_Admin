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
import CircularProgress from '@material-ui/core/CircularProgress';

const ChangePasswordMenu = props => {

    const { handleClose, isLoading, open, handleChange, newPassword, confirmPassword, newPasswordError, confirmPasswordError, onChangeClick } = props;

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
            <Dialog backdropClick open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                        onChange={e => handleChange(e)}
                        value={newPassword}
                        error={newPasswordError}
                        helperText={newPasswordError}
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
                        onChange={e => handleChange(e)}
                        value={confirmPassword}
                        label="Confirm Password"
                        error={confirmPasswordError}
                        helperText={confirmPasswordError}
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
                    <Button variant="contained" onClick={() => onChangeClick()} color="primary">
                        {isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Change"}
                    </Button>
                    <Button variant="outlined" onClick={() => handleClose()} color="primary">
                        Cancel
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

ChangePasswordMenu.propTypes = {
    handleClose: PropTypes.func,
    handleChange: PropTypes.func,
    onPasswordSubmit: PropTypes.func,
    onChangeClick: PropTypes.func,
    open: PropTypes.bool,
    isLoading: PropTypes.bool,
    newPassword: PropTypes.string,
    confirmPassword: PropTypes.string,
    newPasswordError: PropTypes.string,
    confirmPasswordError: PropTypes.string,
};

ChangePasswordMenu.defaultProps = {
    handleClose: fn => fn,
    handleChange: fn => fn,
    onPasswordSubmit: fn => fn,
    onChangeClick: fn => fn,
    open: false,
    isLoading: false,
    newPassword: "",
    confirmPassword: "",
    newPasswordError: "",
    confirmPasswordError: "",
};

export default ChangePasswordMenu;