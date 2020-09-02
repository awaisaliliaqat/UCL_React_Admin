/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    Divider, TextField
} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker, TimePicker } from "@material-ui/pickers";

const useStyles = makeStyles(() => ({
    resize: {
        padding: 9
    },
}));

const ClassScheduleAction = props => {
    const { values, handleClose, open, onSaveClick } = props;
    const classes = useStyles();
    const { selectedData = {}, sendLoading, uploadLoading, saveLoading } = values;

    return (
        <div>
            <Dialog disableBackdropClick disableEscapeKeyDown fullWidth={false}
                maxWidth={'md'} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="simple-dialog-title">
                    <span style={{
                        fontSize: 16,
                        color: '#1558a2',
                        fontWeight: 700
                    }}>Class Re-Schedule</span>
                    <Divider />
                </DialogTitle>
                <DialogContent style={{
                    width: 500,
                }}>
                    <div style={{
                        display: 'flex',
                        marginBottom: 10
                    }}>
                        <Autocomplete
                            id="rooms"
                            getOptionLabel={(option) => option.Label}
                            fullWidth
                            value={{}}
                            options={[]}
                            renderInput={(params) => <TextField InputProps={{ classes: { input: classes.resize } }} error={''} label="Room" variant="outlined" {...params}
                            />}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        marginBottom: 10
                    }}>
                        <DatePicker
                            autoOk
                            invalidDateMessage=""
                            disableFuture
                            variant="inline"
                            inputVariant="outlined"
                            format="dd-MMM-yyyy"
                            fullWidth
                            value={null}
                            label="Date"
                            style={{
                                marginRight: 5
                            }}
                        />
                        <TimePicker fullWidth variant="inline" inputVariant="outlined" autoOk label="Time" value={null} />
                    </div>
                </DialogContent>
                <Divider />
                <DialogActions style={{ justifyContent: 'center', padding: 20 }}>
                    {selectedData.statusId !== 6 &&
                        <Button disabled={!values.accountId || saveLoading} variant="contained"
                            onClick={(e) => onSaveClick(e, selectedData.id)}
                            style={{
                                width: 90
                            }} color="primary">
                            {saveLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Save"}
                        </Button>
                    }
                    <Button disabled={uploadLoading || sendLoading} style={{
                        width: 90
                    }} variant="outlined" onClick={handleClose} color="primary">
                        Close
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

ClassScheduleAction.propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.bool,
    values: PropTypes.object,
    onHandleChange: PropTypes.func,
    onSaveClick: PropTypes.func
};

ClassScheduleAction.defaultProps = {
    handleClose: fn => fn,
    open: false,
    values: {},
    onSaveClick: fn => fn,
    onHandleChange: fn => fn
};

export default ClassScheduleAction;