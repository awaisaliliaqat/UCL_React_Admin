/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    Divider, TextField, Grid, MenuItem
} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker } from "@material-ui/pickers";

const useStyles = makeStyles(() => ({
    resize: {
        padding: 9
    },
}));

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

const ClassScheduleAction = props => {
    
    const { values, handleClose, open, onSaveClick, handleDateChange, onHandleChange, onAutoCompleteChange } = props;
    
    const classes = useStyles();

    return (
        <div>
            <Dialog disableBackdropClick disableEscapeKeyDown fullWidth={false}
                maxWidth={'md'} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="simple-dialog-title">
                    <span style={{
                        fontSize: 16,
                        color: '#1558a2',
                        fontWeight: 700
                    }}>Class Reschedule</span>
                    <Divider />
                </DialogTitle>
                <DialogContent style={{
                    width: 800,
                    marginBottom: 10
                }}>
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item xs={12} md={4}>
                            <DatePicker
                                autoOk
                                invalidDateMessage=""
                                variant="inline"
                                inputVariant="outlined"
                                format="dd-MM-yyyy"
                                fullWidth
                                name="scheduleDate"
                                //minDate={new Date().setDate(new Date().getDate() + 1)}
                                minDate={values.scheduleDate || new Date().setDate(new Date().getDate() + 1)}
                                value={values.scheduleDate}
                                error={values.scheduleDateError}
                                onChange={(date) => handleDateChange(date, "scheduleDate")}
                                label="Date"
                                style={{
                                    marginRight: 5
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="scheduleTime"
                                name="scheduleTime"
                                variant="outlined"
                                label="Time Slot"
                                onChange={onHandleChange}
                                value={values.scheduleTime}
                                error={values.scheduleTimeError}
                                required
                                fullWidth
                                select
                            >
                                {values.scheduleTimeData.map((dt, i) => {
                                    return (
                                        <MenuItem
                                            key={i}
                                            value={dt}
                                        >
                                            {dt}
                                        </MenuItem>
                                    )
                                })
                                }
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="scheduleDuration"
                                name="scheduleDuration"
                                label={"Duration (Minutes)"}
                                type="number"
                                onChange={onHandleChange}
                                value={values.scheduleDuration}
                                error={values.scheduleDurationError}
                                required
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                id="scheduleRoom"
                                name="scheduleRoom"
                                getOptionLabel={(option) => option.Label}
                                fullWidth
                                onChange={(e, value) => onAutoCompleteChange(e, value, "scheduleRoom")}
                                value={values.scheduleRoomObject}
                                options={values.classRoomsData}
                                renderInput={(params) => <TextField InputProps={{ classes: { input: classes.resize } }} error={values.scheduleRoomObjectError} label="Room" variant="outlined" {...params}
                                />}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="capacity"
                                variant="outlined"
                                fullWidth
                                label="Student Capacity"
                                value={isEmpty(values.scheduleRoomObject) ? "" : values.scheduleRoomObject.studentCapacity}
                                readOnly
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions style={{ justifyContent: 'center', padding: 20 }}>
                    <Button disabled={values.isLoading} variant="contained"
                        onClick={() => onSaveClick()}
                        style={{
                            width: 90
                        }} color="primary">
                        {values.isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Save"}
                    </Button>
                    <Button disabled={values.isLoading} style={{
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
    onSaveClick: PropTypes.func,
    handleDateChange: PropTypes.func,
    onAutoCompleteChange: PropTypes.func
};

ClassScheduleAction.defaultProps = {
    handleClose: fn => fn,
    open: false,
    values: {},
    onSaveClick: fn => fn,
    onHandleChange: fn => fn,
    handleDateChange: fn => fn,
    onAutoCompleteChange: fn => fn
};

export default ClassScheduleAction;