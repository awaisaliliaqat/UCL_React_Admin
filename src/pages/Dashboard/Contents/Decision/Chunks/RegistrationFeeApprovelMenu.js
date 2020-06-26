import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    resize: {
        padding: 9
    },
    label: {
        marginTop: 9,
        fontSize: 16,
        color: 'rgb(28, 86, 150)',
        fontWeight: 800,
        marginRight: 10
    },
    button: {
        width: 70,
        height: 35,
        textTransform: 'capitalize',
        backgroundColor: '#245e9e'
    },
    imageContainer: {
        height: 400,
        width: 800,
        border: '1px solid #ccc3c3',
        marginBottom: 20,
        marginTop: 20,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }
}));

const RegistrationFeeApprovelMenu = props => {

    const classes = useStyles();
    const { handleClose, open, data, methodData, methodId, methodIdError, onHandleChange, onConfirmClick, submitLoading } = props;

    return (
        <div>
            <Dialog fullWidth={false}
                maxWidth={'md'} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">

                <DialogContent>
                    <div className={classes.container}>
                        <div style={{
                            display: 'flex',
                        }}>
                            <div className={classes.label}>Method</div>
                            <TextField
                                placeholder="Status"
                                variant="outlined"
                                style={{
                                    width: '160px'
                                }}
                                disabled={data.paymentStatusId === 2}
                                error={methodIdError}
                                name="methodId"
                                onChange={e => onHandleChange(e)}
                                value={methodId}
                                InputProps={{ classes: { input: classes.resize } }}
                                select
                            >
                                {methodData.map((item, index) => {
                                    return (
                                        <MenuItem
                                            key={index}
                                            value={item.ID}
                                        >
                                            {item.Label}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </div>
                        <div>
                            {data.paymentStatusId !== 2 &&
                                <Button style={{
                                    marginRight: 10,
                                }} className={classes.button} variant="contained" onClick={e => onConfirmClick(e, data.paymentId)} color="primary">
                                    {submitLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Confirm"}
                                </Button>
                            }
                            <Button className={classes.button} variant="contained" onClick={handleClose} color="primary">
                                {data.paymentStatusId === 2 ? 'Close' : 'Cancel'}
                            </Button>
                        </div>

                    </div>

                    <div className={classes.imageContainer} style={{
                        backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C03AdmissionsProspectApplicationRegistrationFeeApprovalImageView?fileName=${data.paymentFileName})`,
                    }} />

                </DialogContent>
            </Dialog>
        </div>
    );
}

RegistrationFeeApprovelMenu.propTypes = {
    handleClose: PropTypes.func,
    onHandleChange: PropTypes.func,
    onConfirmClick: PropTypes.func,
    open: PropTypes.bool,
    submitLoading: PropTypes.bool,
    data: PropTypes.object,
    methodData: PropTypes.array,
    methodId: PropTypes.number,
    methodIdError: PropTypes.string
};

RegistrationFeeApprovelMenu.defaultProps = {
    handleClose: fn => fn,
    onHandleChange: fn => fn,
    onConfirmClick: fn => fn,
    open: false,
    submitLoading: false,
    data: {},
    methodData: [],
    methodId: 0,
    methodIdError: ""
};

export default RegistrationFeeApprovelMenu;