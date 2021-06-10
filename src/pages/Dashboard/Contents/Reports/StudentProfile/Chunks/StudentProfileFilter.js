import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { TextField, Button, MenuItem } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

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

const AddmissionDecisionFilter = props => {
    const classes = useStyles();
    const { values, onHandleChange, getDataByStatus, onClearFilters, isLoading, onHandleChangeAS, onHandleChangePG, onHandleChangeProgramme  } = props;


    return (
        <Fragment>
            <div className={classes.container}>

                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>Nucleus ID</span>
                    <TextField
                        placeholder="ID"
                        variant="outlined"
                        InputProps={{ classes: { input: classes.resize } }}
                        value={values.studentId}
                        name="studentId"
                        onChange={e => {
                            onHandleChange(e)

                        }}

                    />
                </div>
                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>Academic Session</span>
                    <TextField
                      id="academicSessionId"
                      name="academicSessionId"
                      variant="outlined"
                      value={values.academicSessionId}
                      InputProps={{ classes: { input: classes.resize } }}
                      onChange={e => {
                        onHandleChangeAS(e);
                    }}
                    //   error={!!values.academicSessionIdError}
                    //   helperText={values.academicSessionIdError}
                      select
                    >
                      {values.academicSessionMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"academicSessionMenuItems"+dt.ID}
                          value={dt.ID}
                        >
                          {dt.Label}
                        </MenuItem>
                      ))}
                    </TextField>
                    
                </div>
                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>Programme Group</span>
                    <TextField
                      id="programmeGroupId"
                      name="programmeGroupId"
                      variant="outlined"
                      value={values.programmeGroupId}
                      InputProps={{ classes: { input: classes.resize } }}
                      onChange={e => {
                        onHandleChangePG(e);
                    }}
                    //   error={!!values.academicSessionIdError}
                    //   helperText={values.academicSessionIdError}
                      select
                    >
                      {values.programmeGroupsMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"programmeGroupsMenuItems"+dt.Id}
                          value={dt.Id}
                        >
                          {dt.Label}
                        </MenuItem>
                      ))}
                    </TextField>
                    
                </div>

                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>Programme</span>
                    <TextField
                      id="programmeId"
                      name="programmeId"
                      variant="outlined"
                      value={values.programmeId}
                      InputProps={{ classes: { input: classes.resize } }}
                      onChange={e => {
                        onHandleChangeProgramme(e);
                    }}
                    //   error={!!values.academicSessionIdError}
                    //   helperText={values.academicSessionIdError}
                      select
                    >
                      {values.programmeIdMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"programmeIdMenuItems"+dt.ID}
                          value={dt.ID}
                        >
                          {dt.Label}
                        </MenuItem>
                      ))}
                    </TextField>
                    
                </div>
                <div className={classes.actions}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        disabled={isLoading}
                        disabled={!values.programmeId}
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

AddmissionDecisionFilter.defaultProps = {
    onHandleChange: fn => fn,
    getDataByStatus: fn => fn,
    values: {},
    onClearFilters: fn => fn,
    handleDateChange: fn => fn,
    isLoading: false.valueOf,
    onHandleChangeAS: fn => fn,
    onHandleChangePG: fn => fn,
    onHandleChangeProgramme: fn => fn




};

AddmissionDecisionFilter.propTypes = {
    onHandleChange: PropTypes.func,
    onHandleChangeAS: PropTypes.func,
    onHandleChangePG: PropTypes.func,
    onHandleChangeProgramme: PropTypes.func,
    values: PropTypes.object,
    getDataByStatus: PropTypes.func,
    onClearFilters: PropTypes.func,
    handleDateChange: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default AddmissionDecisionFilter;