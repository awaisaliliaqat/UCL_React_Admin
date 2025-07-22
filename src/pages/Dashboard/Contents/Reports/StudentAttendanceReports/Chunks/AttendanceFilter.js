import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { Button, TextField, MenuItem } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DatePicker } from "@material-ui/pickers";
import Autocomplete from '@material-ui/lab/Autocomplete';

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

const AttendanceFilter = props => {
    const classes = useStyles();
    const { values, handleDateChange, getDataByStatus, onClearFilters, onHandleChange, isLoading, handleAutocompleteChange } = props;


    return (
        <Fragment>
            <div className={classes.container}>


               
                <div className={classes.item} style={{
                    width: '20%'
                }}>
                <span className={classes.label}>Session*</span>    
                <TextField
                id="academicSessionId"
                name="academicSessionId"
                variant="outlined"
                placeholder="Session"
                InputProps={{ classes: { input: classes.resize } }}
                fullWidth
                select
                onChange={e => {
                    onHandleChange(e);
                }}
                value={values.academicSessionId}
                error={!!values.academicSessionIdError}
                helperText={values.academicSessionIdError ? values.academicSessionIdError : ""}
                // disabled={!this.state.schoolId}
              >
                {values.academicSessionMenuItems && !values.isLoading ? 
                  values.academicSessionMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"academicSessionMenuItems"+dt.ID}
                      value={dt.ID}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))
                :
                  <div 
                    container 
                    justifyContent="center"
                  >
                    <CircularProgress />
                  </div>
                }
              </TextField>
              </div>
               

                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>Section Type *</span>

                    <TextField
                        placeholder="Section Type"
                        variant="outlined"
                        name="sectionTypeId"
                        id="sectionTypeId"
                        InputProps={{ classes: { input: classes.resize } }}
                        value={values.sectionTypeId}
                        onChange={e => {
                            onHandleChange(e);
                        }}
                        select
                    >
                        {values.sectionTypeData.map(item => {
                            return (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.label}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </div>
                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>Section *</span>
                    <Autocomplete
                        id="section"
                        getOptionLabel={(option) => typeof option.label === "string" ? option.label : ""}
                        fullWidth
                        value={values.sectionObject}
                        onChange={(e, value) => handleAutocompleteChange(e, value, "section")}
                        options={values.sectionData}
                        disabled={!values.sectionTypeId}
                        renderInput={(params) => <TextField error={values.sectionIdError} variant="outlined" placeholder="Sections" {...params}
                            size="small"
                        />}
                    />
                </div>

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
                        disabled={isLoading || !values.sectionId}
                        onClick={() => getDataByStatus(values.sectionId)}
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

AttendanceFilter.defaultProps = {
    onHandleChange: fn => fn,
    handleAutocompleteChange: fn => fn,
    getDataByStatus: fn => fn,
    values: {},
    onClearFilters: fn => fn,
    handleDateChange: fn => fn,
    getDataFilters: fn => fn,
    isLoading: false




};

AttendanceFilter.propTypes = {
    onHandleChange: PropTypes.func,
    handleAutocompleteChange: PropTypes.func,
    values: PropTypes.object,
    getDataByStatus: PropTypes.func,
    onClearFilters: PropTypes.func,
    handleDateChange: PropTypes.func,
    getDataFilters: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default AttendanceFilter;