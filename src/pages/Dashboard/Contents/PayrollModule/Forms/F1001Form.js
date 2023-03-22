/* eslint-disable react/prop-types */
import React, { Fragment, Component } from 'react';
import { format } from 'date-fns'
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import {Switch} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import { DatePicker } from "@material-ui/pickers";
import CircularProgress from '@material-ui/core/CircularProgress';
import { alphabetExp, numberExp, emailExp } from '../../../../../utils/regularExpression';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Card, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const styles = () => ({
    root: {
        padding: 20,
    },
    formControl: {
        minWidth: '100%',
    },
    sectionTitle: {
        fontSize: 19,
        color: '#174a84',
    },
    checkboxDividerLabel: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 20,
        fontSize: 16,
        fontWeight: 600
    },
    rootProgress: {
        width: '100%',
        textAlign: 'center',
    },
});


function isEmpty(obj) {

    if (obj == null) return true;

    if (typeof obj !== "object") return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}




class F1001Form extends Component {
    constructor(props) {
        super(props);
        this.state = {

            teacherData: [],
            teacherIdError: "",
            teacherIdObject: {},
            teacherId: "",

            hoursRequired: "",
            hoursRequiredError: "",

            scheduleHours: "",
            scheduleHoursError: "",

            salaryHours: "",
            salaryHoursError: "",

            claimHours: "",
            claimHoursError: "",

        }
    }

    componentDidMount() {
    }



    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <Grid container component="main" className={classes.root}>
                    <Typography style={{
                        color: '#1d5f98', fontWeight: 600, borderBottom: '1px solid #d2d2d2',
                        width: '98%', marginBottom: 25, fontSize: 20
                    }} variant="h5">
                        Payroll Setup
                    </Typography>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3'
                    }} />
                     <Grid container spacing={2} style={{ marginLeft: 5, marginRight: 10 }}>
                         <Grid  item xs={6}> 
                         <Autocomplete
                                id="teacherId"
                                getOptionLabel={(option) => typeof option.Label === "string" ? option.Label : ""}
                                fullWidth
                                options={this.state.teacherMenuItems}
                                // onChange={this.handleAutoComplete("permanentProvinceId")}
                                // value={this.state.permanentProvinceIdObject}
                                renderInput={(params) => <TextField label="Select Teacher" error={!!this.state.teacherIdError} {...params}
                                />}
                            />
                         </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="hoursRequired"
                                name="hoursRequired"
                                label="Hours Required"
                                required
                                fullWidth
                                // onKeyDown={this.StopEnter}
                                // onChange={this.handleChange}
                                value={this.state.hoursRequired}
                                error={!!this.state.hoursRequiredError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                                id="scheduleHours"
                                name="scheduleHours"
                                label="Schedule Hours"
                                required
                                fullWidth
                                // onChange={this.handleChange}
                                value={this.state.scheduleHours}
                                error={!!this.state.scheduleHoursError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                                id="salaryHours"
                                name="salaryHours"
                                label="Salary Hours"
                                required
                                fullWidth
                                // onChange={this.handleChange}
                                value={this.state.salaryHours}
                                error={!!this.state.salaryHoursError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                    id="claimHours"
                                    name="claimHours"
                                    label="Claim Hours"
                                    required
                                    fullWidth
                                    // onChange={this.handleChange}
                                    value={this.state.claimHours}
                                    error={!!this.state.claimHoursError}
                                />
                        </Grid>
                    </Grid>
                </Grid>
                <BottomBar
                    left_button_text="View"
                    left_button_hide={false}
                    // bottomLeftButtonAction={() => this.viewReport()}
                    right_button_text="Save"
                    // bottomRightButtonAction={() => this.clickOnFormSubmit()}
                    loading={this.state.isLoading}
                    isDrawerOpen={this.props.isDrawerOpen}
                    />

                <CustomizedSnackbar
                    isOpen={this.state.isOpenSnackbar}
                    message={this.state.snackbarMessage}
                    severity={this.state.snackbarSeverity}
                    handleCloseSnackbar={() => this.handleCloseSnackbar()}
                    />

            </Fragment >
        );
    }
}

F1001Form.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(F1001Form);