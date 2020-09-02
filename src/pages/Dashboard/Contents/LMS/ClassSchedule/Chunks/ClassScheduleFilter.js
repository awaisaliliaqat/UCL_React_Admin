import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DatePicker } from "@material-ui/pickers";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
        marginTop: 10
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: 10,
    },
    resize: {
        padding: 10
    },
    actions: {
        display: 'flex',
        flexDirection: 'row',
        width: '15%',
        marginTop: 29,
    },
    label: {
        textAlign: 'left',
        font: 'bold 14px Lato',
        letterSpacing: 0,
        color: '#174A84',
        opacity: 1,
        marginTop: 5,
        marginBottom: 5,
        inlineSize: 'max-content'
    },
    button: {
        textTransform: 'capitalize',
        backgroundColor: '#174A84',
        fontSize: 14
    }
}));

const ClassScheduleFilter = props => {
    const classes = useStyles();
    const { values, handleDateChange, getDataByStatus, onClearFilters, isLoading } = props;


    return (
        <Fragment>
            <div className={classes.container}>
                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>From Date</span>
                    <DatePicker
                        autoOk
                        invalidDateMessage=""
                        placeholder="Date"
                        disableFuture
                        variant="inline"
                        inputVariant="outlined"
                        format="dd-MMM-yyyy"
                        fullWidth
                        value={values.fromDate}
                        InputProps={{

                            classes: { input: classes.resize }
                        }}
                        onChange={(date) => {
                            handleDateChange(date, "fromDate");
                        }}

                    />
                </div>
                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>To Date</span>
                    <DatePicker
                        autoOk
                        invalidDateMessage=""
                        placeholder="Date"
                        disableFuture
                        variant="inline"
                        inputVariant="outlined"
                        format="dd-MMM-yyyy"
                        fullWidth
                        value={values.toDate}
                        InputProps={{

                            classes: { input: classes.resize }
                        }}
                        onChange={(date) => {
                            handleDateChange(date, "toDate");
                        }}

                    />
                </div>

                <div className={classes.actions}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        disabled={isLoading || !values.teacherId}
                        onClick={() => getDataByStatus(values.teacherId)}
                    > {isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Search"}</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        style={{
                            marginLeft: 8,
                        }}
                        onClick={() => onClearFilters()}
                    >Clear</Button>
                </div>
            </div>
            <Divider style={{
                backgroundColor: 'rgb(58, 127, 187)',
                opacity: '0.3',
            }} />

        </Fragment>
    );
}

ClassScheduleFilter.defaultProps = {
    onHandleChange: fn => fn,
    getDataByStatus: fn => fn,
    onAutoCompleteChange: fn => fn,
    values: {},
    onClearFilters: fn => fn,
    handleDateChange: fn => fn,
    getDataFilters: fn => fn,
    isLoading: false

};

ClassScheduleFilter.propTypes = {
    onHandleChange: PropTypes.func,
    onAutoCompleteChange: PropTypes.func,
    values: PropTypes.object,
    getDataByStatus: PropTypes.func,
    onClearFilters: PropTypes.func,
    handleDateChange: PropTypes.func,
    getDataFilters: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default ClassScheduleFilter;