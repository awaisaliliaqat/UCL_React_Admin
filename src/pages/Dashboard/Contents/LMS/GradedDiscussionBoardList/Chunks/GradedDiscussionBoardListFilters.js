import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DatePicker } from "@material-ui/pickers";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

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

const GradedDiscussionBoardListFilters = props => {
    const classes = useStyles();
    const { values, getDataByStatus, onClearFilters, isLoading, handleDateChange, onHandleChange } = props;


    return (
        <Fragment>
            <div className={classes.container}>
                <div className={classes.item} style={{
                    width: '15%'
                }}>
                    <span className={classes.label}>Section</span>
                    <TextField
                        placeholder="Section"
                        variant="outlined"
                        name="sectionId"
                        id="sectionId"
                        InputProps={{ classes: { input: classes.resize } }}
                        value={values.sectionId}
                        onChange={e => {
                            onHandleChange(e);
                        }}
                        select
                    >
                        <MenuItem value={0}>
                            All
                        </MenuItem>
                        {values.sectionData.map(item => {
                            return (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.label}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </div>
                <div className={classes.item} style={{
                    width: '15%'
                }}>
                    <span className={classes.label}>Start Date</span>
                    <DatePicker
                        autoOk
                        invalidDateMessage=""
                        placeholder="Start Date"
                        variant="inline"
                        inputVariant="outlined"
                        format="dd-MM-yyyy"
                        fullWidth
                        value={values.startDate}
                        onChange={date => handleDateChange(date, "startDate")}
                        defaultValue={values.startDate}
                        InputProps={{
                            classes: { input: classes.resize }
                        }}

                    />
                </div>
                <div className={classes.item} style={{
                    width: '15%'
                }}>
                    <span className={classes.label}>Due Date</span>
                    <DatePicker
                        autoOk
                        invalidDateMessage=""
                        placeholder="Due Date"
                        variant="inline"
                        inputVariant="outlined"
                        format="dd-MM-yyyy"
                        onChange={date => handleDateChange(date, "dueDate")}
                        value={values.dueDate}
                        defaultValue={values.dueDate}
                        fullWidth
                        InputProps={{
                            classes: { input: classes.resize }
                        }}

                    />
                </div>
                <div className={classes.actions}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        disabled={isLoading}
                        onClick={() => getDataByStatus()}
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

GradedDiscussionBoardListFilters.defaultProps = {
    onHandleChange: fn => fn,
    getDataByStatus: fn => fn,
    values: {},
    onClearFilters: fn => fn,
    handleDateChange: fn => fn,
    isLoading: false




};

GradedDiscussionBoardListFilters.propTypes = {
    onHandleChange: PropTypes.func,
    values: PropTypes.object,
    getDataByStatus: PropTypes.func,
    onClearFilters: PropTypes.func,
    handleDateChange: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default GradedDiscussionBoardListFilters;