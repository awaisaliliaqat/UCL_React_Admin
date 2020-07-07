import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { TextField, Button } from '@material-ui/core';
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

const DocumentRequestFilter = props => {
    const classes = useStyles();
    const { values, onHandleChange, getDataByStatus, onClearFilters, isLoading } = props;


    return (
        <Fragment>
            <div className={classes.container}>

                <div className={classes.item} style={{
                    width: '20%'
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
                {/* <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>Degree Programme</span>
                    <TextField
                        placeholder="Degree Programme"
                        variant="outlined"
                        select
                        InputProps={{ classes: { input: classes.resize } }}
                        value={values.degreeId}
                        name="degreeId"
                        onChange={e => {
                            onHandleChange(e)

                        }}
                    >
                        <MenuItem value={0}>
                            All
                            </MenuItem>
                        {values.degreeData.map((item, index) => {
                            return (
                                <MenuItem
                                    key={index}
                                    disabled={!item.id}
                                    value={item.id}
                                >
                                    {item.label}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </div> */}
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

DocumentRequestFilter.defaultProps = {
    onHandleChange: fn => fn,
    getDataByStatus: fn => fn,
    values: {},
    onClearFilters: fn => fn,
    isLoading: false




};

DocumentRequestFilter.propTypes = {
    onHandleChange: PropTypes.func,
    values: PropTypes.object,
    getDataByStatus: PropTypes.func,
    onClearFilters: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default DocumentRequestFilter;