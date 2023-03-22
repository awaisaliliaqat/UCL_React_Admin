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
    const { values, onHandleChange, getDataByStatus, onClearFilters, isLoading } = props;


    return (
        <Fragment>
            <div className={classes.container}>

                <div className={classes.item} style={{
                    width: '15%'
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
                    width: '15%'
                }}>
                    <span className={classes.label}>Application ID</span>
                    <TextField
                        placeholder="ID"
                        variant="outlined"
                        InputProps={{ classes: { input: classes.resize } }}
                        value={values.applicationId}
                        name="applicationId"
                        onChange={e => {
                            onHandleChange(e)
                        }}
                    />
                </div>
                <div className={classes.item} style={{ width: "20%" }}>
                  <span className={classes.label}>Name</span>
                  <TextField
                    placeholder="Name"
                    variant="outlined"
                    InputProps={{ classes: { input: classes.resize } }}
                    value={values.studentName}
                    name="studentName"
                    onChange={(e) => {
                      onHandleChange(e);
                    }}
                  />
                </div>
                <div className={classes.item} style={{ width: "20%" }}>
                  <span className={classes.label}>Programme Group</span>
                  <TextField
                    placeholder="Status"
                    variant="outlined"
                    InputProps={{ classes: { input: classes.resize } }}
                    value={values.programmeGroupId}
                    name="programmeGroupId"
                    onChange={(e) => {
                      onHandleChange(e);
                    }}
                    select
                  >
                    {values.programmeGroupsMenuItems.map((item) => 
                        <MenuItem key={item.ID} value={item.ID}>
                            {item.Label}
                        </MenuItem>    
                    )}
                  </TextField>
                </div>
                <div className={classes.item} style={{ width: "20%" }}>
                  <span className={classes.label}>Status</span>
                  <TextField
                    placeholder="Status"
                    variant="outlined"
                    InputProps={{ classes: { input: classes.resize } }}
                    value={values.studentStatus}
                    name="studentStatus"
                    onChange={(e) => {
                      onHandleChange(e);
                    }}
                    select
                  >
                    {/* <MenuItem value={0}>All</MenuItem> */}
                    <MenuItem value={0}>Deactive</MenuItem>
                    <MenuItem value={1} selected={true}>
                      Active
                    </MenuItem>
                  </TextField>
                </div>

                <div className={classes.item} style={{ width: "20%" }}>
                  <span className={classes.label}>Picture Status</span>
                  <TextField
                    placeholder="Picture Status"
                    variant="outlined"
                    InputProps={{ classes: { input: classes.resize } }}
                    value={values.pictureStatus}
                    name="pictureStatus"
                    onChange={(e) => {
                      onHandleChange(e);
                    }}
                    select
                  >
                    <MenuItem value={1}>With</MenuItem>
                    <MenuItem value={2}>Without</MenuItem>
                  </TextField>
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

AddmissionDecisionFilter.defaultProps = {
    onHandleChange: fn => fn,
    getDataByStatus: fn => fn,
    values: {},
    onClearFilters: fn => fn,
    handleDateChange: fn => fn,
    isLoading: false




};

AddmissionDecisionFilter.propTypes = {
    onHandleChange: PropTypes.func,
    values: PropTypes.object,
    getDataByStatus: PropTypes.func,
    onClearFilters: PropTypes.func,
    handleDateChange: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default AddmissionDecisionFilter;