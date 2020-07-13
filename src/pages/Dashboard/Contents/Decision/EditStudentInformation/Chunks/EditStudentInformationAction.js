/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import LoginMenu from '../../../../../../components/LoginMenu/LoginMenu';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Dialog, DialogContent } from '@material-ui/core';
import { DatePicker } from "@material-ui/pickers";
import { withStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { alphabetExp, numberExp } from '../../../../../../utils/regularExpression';

const styles = () => ({
    root: {
        padding: 20,
        marginTop: 10
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

class DocumentRequestAction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            applicationId: props.match.params.id,

            /////////////////Personal Information State///////////////////

            firstName: "",
            firstNameError: "",
            middleName: "",
            middleNameError: "",
            lastName: "",
            lastNameError: "",
            dateOfBirth: null,
            dateOfBirthError: "",
            mobileNo: "",
            mobileNoError: "",

            /////////////////Father Information State///////////////////

            fatherMobileNo: "",
            fatherMobileNoError: "",


            /////////////////Mother Information State///////////////////

            motherMobileNo: "",
            motherMobileNoError: "",

            /////////////////Mother Information State///////////////////

            guardianMobileNo: "",
            guardianMobileNoError: "",


            data: {},
            degreeData: [],
            isLoading: false,
            isLoginMenu: false,
            isReload: false,

        }
    }


    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        this.setState({
            isLoading: true
        })
        await this.getData();
        this.setState({
            isLoading: false
        })
    }

    isFormValid = () => {
        let isValid = true;
        let { guardianMobileNoError, motherMobileNoError, fatherMobileNoError, dateOfBirthError,
            firstNameError, lastNameError, mobileNoError } = this.state;
        if (!this.state.guardianMobileNo) {
            // guardianMobileNoError = "Please enter a valid mobile number e.g 03001234567"
            // document.getElementById("guardianMobileNo").focus();
            // isValid = false;
        } else {
            guardianMobileNoError = ""
            if (!this.state.guardianMobileNo.startsWith("03") || this.state.guardianMobileNo.split('').length !== 11) {
                guardianMobileNoError = "Please enter a valid mobile number e.g 03001234567"
                document.getElementById("guardianMobileNo").focus();
                isValid = false;
            } else {
                guardianMobileNoError = ""
            }
        }

        if (!this.state.motherMobileNo) {
            // motherMobileNoError = "Please enter a valid mobile number e.g 03001234567"
            // document.getElementById("motherMobileNo").focus();
            // isValid = false;
        } else {
            motherMobileNoError = ""
            if (!this.state.motherMobileNo.startsWith("03") || this.state.motherMobileNo.split('').length !== 11) {
                motherMobileNoError = "Please enter a valid mobile number e.g 03001234567"
                document.getElementById("motherMobileNo").focus();
                isValid = false;
            } else {
                motherMobileNoError = ""
            }
        }

        if (!this.state.fatherMobileNo) {
            // fatherMobileNoError = "Please enter a valid mobile number e.g 03001234567"
            // document.getElementById("fatherMobileNo").focus();
            // isValid = false;
        } else {
            fatherMobileNoError = ""
            if (!this.state.fatherMobileNo.startsWith("03") || this.state.fatherMobileNo.split('').length !== 11) {
                fatherMobileNoError = "Please enter a valid mobile number e.g 03001234567"
                document.getElementById("fatherMobileNo").focus();
                isValid = false;
            } else {
                fatherMobileNoError = ""
            }
        }

        if (!this.state.mobileNo) {
            mobileNoError = "Please enter mobile number"
            document.getElementById("mobileNo").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            mobileNoError = "";
            if (!this.state.mobileNo.startsWith("03") || this.state.mobileNo.split('').length !== 11) {
                mobileNoError = "Please enter a valid mobile number e.g 03001234567"
                document.getElementById("mobileNo").focus();
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                isValid = false;
            } else {
                mobileNoError = ""
            }
        }

        if (!this.state.dateOfBirth) {
            dateOfBirthError = "Please select date of birth"
            document.getElementById("dateOfBirth").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            dateOfBirthError = "";
        }

        if (!this.state.lastName) {
            lastNameError = "Please enter last name"
            document.getElementById("lastName").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            lastNameError = "";
        }

        if (!this.state.firstName) {
            firstNameError = "Please enter first name"
            document.getElementById("firstName").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            firstNameError = "";
        }

        this.setState({
            guardianMobileNoError,
            motherMobileNoError,
            fatherMobileNoError,
            mobileNoError,
            dateOfBirthError,
            firstNameError,
            lastNameError,
        })

        return isValid;
    }

    handleOnClick = () => {
        if (this.isFormValid()) {
            document.getElementById('submit-button').click();
        }
    }

    onFormSubmit = async e => {
        e.preventDefault();
        const data = new FormData(e.target);
        this.setState({
            isLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C21CommonStudentsSave`;
        await fetch(url, {
            method: "POST", body: data, headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                json => {
                    if (json.CODE === 1) {
                        alert("Saved");
                        document.documentElement.scrollTop = 0;
                    } else {
                        alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
                    }
                    console.log(json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        console.log(error);
                        alert("Failed to Save ! Please try Again later.")
                    }
                });
        this.setState({
            isLoading: false
        })
    }

    StopEnter(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    }

    setData = (data = {}) => {

        const dob = data.dateOfBirthWithoutConversion ? new Date(data.dateOfBirthWithoutConversion) : new Date();

        this.setState({
            firstName: data.firstName || "",
            middleName: data.middleName || "",
            lastName: data.lastName || "",
            dateOfBirth: dob,
            mobileNo: data.mobileNo || "",

            fatherMobileNo: data.fatherMobileNo || "",

            motherMobileNo: data.motherMobileNo || "",

            guardianMobileNo: data.guardianMobileNo || "",

            data,

        })
    }

    getData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C21CommonStudentsView?id=${this.state.applicationId}`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                json => {
                    if (json.CODE === 1) {
                        if (json.DATA) {
                            if (json.DATA.length > 0) {
                                this.setData(json.DATA[0]);
                            }
                        }
                    } else {
                        alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
                    }
                    console.log(json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                });

    }

    handleChange = e => {
        const { name, value } = e.target;
        const errName = `${name}Error`;
        let regex = "";
        switch (name) {
            case "firstName":
            case "middleName":
            case "lastName":
                regex = new RegExp(alphabetExp);
                if (value && !regex.test(value)) {
                    return;
                }
                break;
            case "mobileNo":
            case "fatherMobileNo":
            case "motherMobileNo":
            case "guardianMobileNo":
                regex = new RegExp(numberExp);
                if (value && !regex.test(value)) {
                    return;
                }
                break;
            default:
                break;
        }

        this.setState({
            [name]: value,
            [errName]: ""
        })
    }


    handleDateChange = date => {
        this.setState({
            dateOfBirth: date,
            dateOfBirthError: ""
        })
    }

    render() {
        const userDob = format(this.state.dateOfBirth || new Date('2000-01-01'), 'dd/MM/yyyy');
        const { classes } = this.props;

        return (
            <Fragment>
                <Dialog
                    open={this.state.isLoading}
                    disableBackdropClick
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <CircularProgress />
                        <span style={{
                            marginTop: 15,
                            marginBottom: 15
                        }}>Please Wait...</span>
                    </DialogContent>
                </Dialog>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <div style={{
                    paddingTop: 10,
                    paddingLeft: 30,
                    paddingRight: 30
                }}>
                    <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                        <IconButton style={{
                            paddingBottom: 0,
                            marginTop: '-10px'
                        }} aria-label="Back">
                            <Link style={{
                                textDecoration: 'none',
                                color: 'gray'
                            }} to="/dashboard/edit-student-information"><ArrowBackIcon /></Link>
                        </IconButton> Nucleus ID: {this.state.data.studentId}
                    </Typography>

                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <Grid container component="main" className={classes.root}>
                        <Grid container spacing={2}>

                            <Grid style={{ paddingTop: 10 }} xs={12}>
                                <span className={classes.sectionTitle}>
                                    Personal Information
                            </span>
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    required
                                    fullWidth
                                    onKeyDown={this.StopEnter}
                                    onChange={this.handleChange}
                                    value={this.state.firstName}
                                    error={!!this.state.firstNameError}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="middleName"
                                    name="middleName"
                                    label="Middle Name"
                                    fullWidth
                                    onKeyDown={this.StopEnter}
                                    onChange={this.handleChange}
                                    value={this.state.middleName}
                                    error={!!this.state.middleNameError}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    required
                                    fullWidth
                                    onKeyDown={this.StopEnter}
                                    onChange={this.handleChange}
                                    value={this.state.lastName}
                                    error={!!this.state.lastNameError}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker
                                    format="dd-MMM-yyyy"
                                    views={["year", "month", "date"]}
                                    openTo={"year"}
                                    autoOk
                                    invalidDateMessage=""
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    id="dateOfBirth"
                                    value={this.state.dateOfBirth}
                                    onChange={this.handleDateChange}
                                    required
                                    disableFuture
                                    error={!!this.state.dateOfBirthError}
                                    disableOpenOnEnter
                                    animateYearScrolling={false}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    id="mobileNo"
                                    name="mobileNo"
                                    label="Mobile No"
                                    type="text"
                                    inputProps={{
                                        maxLength: 11
                                    }}
                                    onChange={this.handleChange}
                                    placeholder="e.g 03XXXXXXXXX"
                                    helperText={this.state.mobileNo ? this.state.mobileNoError : ""}
                                    value={this.state.mobileNo}
                                    error={!!this.state.mobileNoError}
                                    required
                                    fullWidth
                                    onKeyDown={this.StopEnter}
                                />
                            </Grid>

                            <Grid xs={12} style={{ paddingTop: 20 }}>
                                <span className={classes.sectionTitle}>
                                    Father&apos;s Information
                            </span>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    id="fatherMobileNo"
                                    name="fatherMobileNo"
                                    value={this.state.fatherMobileNo}
                                    onChange={this.handleChange}
                                    error={!!this.state.fatherMobileNoError}
                                    label="Mobile Number"
                                    helperText={this.state.fatherMobileNo ? this.state.fatherMobileNoError : ""}
                                    placeholder="e.g 03XXXXXXXXX"
                                    inputProps={{
                                        maxLength: 11
                                    }}
                                    type="text"
                                    onKeyDown={this.keyPress}
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12} style={{ paddingTop: 20 }}>
                                <span className={classes.sectionTitle}>
                                    Mother&apos;s Information
                            </span>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    id="motherMobileNo"
                                    name="motherMobileNo"
                                    value={this.state.motherMobileNo}
                                    error={!!this.state.motherMobileNoError}
                                    onChange={this.handleChange}
                                    label="Mobile Number"
                                    placeholder="e.g 03XXXXXXXXX"
                                    helperText={this.state.motherMobileNo ? this.state.motherMobileNoError : ""}
                                    inputProps={{
                                        maxLength: 11
                                    }}
                                    type="text"
                                    onKeyDown={this.keyPress}
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12} style={{ paddingTop: 20 }}>
                                <span className={classes.sectionTitle}>
                                    Guardian&apos;s Information
                            </span>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    id="guardianMobileNo"
                                    name="guardianMobileNo"
                                    label="Mobile Number"
                                    placeholder="e.g 03XXXXXXXXX"
                                    helperText={this.state.guardianMobileNo ? this.state.guardianMobileNoError : ""}
                                    value={this.state.guardianMobileNo}
                                    error={!!this.state.guardianMobileNoError}
                                    onChange={this.handleChange}
                                    type="text"
                                    inputProps={{
                                        maxLength: 11
                                    }}
                                    onKeyDown={this.keyPress}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} style={{ paddingTop: 30, display: 'flex' }} justify="center">
                                <Button disabled={this.state.isLoading} onClick={this.handleOnClick} color="primary" variant="contained" style={{ width: '100%', backgroundColor: '#174A84' }}>
                                    {this.state.isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Save"}
                                </Button>
                            </Grid>


                        </Grid>
                    </Grid>

                </div>

                <form onSubmit={this.onFormSubmit}>
                    <input type="hidden" value={this.state.applicationId} name="id" />

                    <input type="hidden" value={this.state.firstName} name="firstName" />
                    <input type="hidden" value={this.state.middleName} name="middleName" />
                    <input type="hidden" value={this.state.lastName} name="lastName" />
                    <input type="hidden" value={userDob} name="dateOfBirth" />
                    <input type="hidden" value={this.state.mobileNo} name="mobileNo" />

                    <input type="hidden" value={this.state.fatherMobileNo} name="fatherMobileNo" />

                    <input type="hidden" value={this.state.motherMobileNo} name="motherMobileNo" />

                    <input type="hidden" value={this.state.guardianMobileNo} name="guardianMobileNo" />

                    <button style={{ display: 'none' }} id="submit-button" type="submit" />
                </form>
            </Fragment>
        );
    }
}

DocumentRequestAction.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DocumentRequestAction);