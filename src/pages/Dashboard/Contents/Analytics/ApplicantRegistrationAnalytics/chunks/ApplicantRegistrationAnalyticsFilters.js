import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker } from "@material-ui/pickers";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({

    resize: {
        padding: 10
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: 10,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
        marginTop: 10
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

const ApplicantRegistrationAnalyticsFilters = props => {
    const classes = useStyles();
    const { isLoading } = props;

    return (
        <Fragment>
            <div className={classes.container}>
                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>From</span>
                    <DatePicker
                        autoOk
                        invalidDateMessage=""
                        placeholder="Payment Date"
                        disableFuture
                        variant="inline"
                        inputVariant="outlined"
                        format="dd-MMM-yyyy"
                        fullWidth
                        InputProps={{

                            classes: { input: classes.resize }
                        }}

                    />
                </div>
                <div className={classes.item} style={{
                    width: '20%'
                }}>
                    <span className={classes.label}>To</span>
                    <DatePicker
                        autoOk
                        invalidDateMessage=""
                        placeholder="Payment Date"
                        disableFuture
                        variant="inline"
                        inputVariant="outlined"
                        format="dd-MMM-yyyy"
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
                    > {isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Search"}</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        style={{
                            marginLeft: 8,
                        }}
                    >Clear</Button>
                </div>

            </div>
        </Fragment>
    );
}

ApplicantRegistrationAnalyticsFilters.defaultProps = {

    isLoading: false,

}

ApplicantRegistrationAnalyticsFilters.propTypes = {

    isLoading: PropTypes.bool,

}

export default ApplicantRegistrationAnalyticsFilters;