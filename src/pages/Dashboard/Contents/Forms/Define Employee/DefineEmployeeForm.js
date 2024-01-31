import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import { TextField, Grid, Divider, Typography, MenuItem } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { alphabetExp, numberExp, emailExp } from '../../../../../utils/regularExpression';
import PropTypes from "prop-types";
import DefineEmployeeRolesSection from './Chunks/DefineEmployeeRolesSection';

const styles = () => ({
    root: {
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
});

class DefineEmployeeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {

            recordId: this.props.match.params.recordId,
            isLoading: false,
            isReload: false,
            showPass: false,

            firstName: "",
            firstNameError: "",
            lastName: "",
            lastNameError: "",
            displayName: "",
            displayNameError: "",
            mobileNo: "",
            mobileNoError: "",
            email: "",
            emailError: "",
            discipline: "",
            disciplineError: "",
            jobStatusId: "",
            jobStatusIdError: "",
            address: "",
            addressError: "",
            password: "",
            passwordError: "",

            jobStatusIdData: [],

            employeesRolesData: [],
            employeesRolesDataLoading: false,
            employeesRolesArray: [],
            employeesRolesArrayError: "",

            employeesEntitiesData: [],
            employeesEntitiesDataLoading: false,
            employeesEntitiesArray: [],
            employeesEntitiesArrayError: "",

            employeesDepartmentsData: [],
            employeesDepartmentsDataLoading: false,
            employeesDepartmentsArray: [],
            employeesDepartmentsArrayError: "",

            employeesSubDepartmentsData: [],
            employeesSubDepartmentsDataLoading: false,
            employeesSubDepartmentsArray: [],
            employeesSubDepartmentsArrayError: "",

            employeesDesignationsData: [],
            employeesDesignationsDataLoading: false,
            employeesDesignationsArray: [],
            employeesDesignationsArrayError: "",

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: ""
        }
    }

    componentDidMount() {
        if (this.state.recordId != 0) {
            this.loadData(this.state.recordId);
        }
        this.getEmployeesJobStatusData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.match.params.recordId != nextProps.match.params.recordId) {
            if (nextProps.match.params.recordId != 0) {
                this.loadData(nextProps.match.params.recordId);
                this.setState({
                    recordId: nextProps.match.params.recordId,
                })
            } else {
                window.location.reload();
            }
        }
    }

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar: true,
            snackbarMessage: msg,
            snackbarSeverity: severity
        });
    };

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenSnackbar: false
        });
    };

    loadData = async (index) => {
        const data = new FormData();
        data.append("id", index);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonUsersView`;
        await fetch(url, {
            method: "POST",
            body: data,
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
                                const { firstName, lastName, displayName, mobileNo, email, discipline, jobStatusId, address, password
                                } = json.DATA[0];
                                this.setState({
                                    firstName,
                                    lastName,
                                    displayName,
                                    mobileNo,
                                    email,
                                    discipline,
                                    jobStatusId,
                                    address,
                                    password,
                                });
                            }
                        }
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
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
                        console.log(error);
                        this.handleOpenSnackbar("Failed to Load Data ! Please try Again later.", "error");
                    }
                });
        this.setState({ isLoading: false })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        const errName = `${name}Error`;

        let regex = "";
        switch (name) {
            case "firstName":
            case "lastName":
            case "displayName":
                regex = new RegExp(alphabetExp);
                if (value && !regex.test(value)) {
                    return;
                }
                break;
            case "mobileNo":
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

    isFormValid = () => {
        let isValid = true;
        let regex = "";
        let { firstNameError, lastNameError, displayNameError, mobileNoError, emailError, disciplineError, jobStatusIdError,
            addressError, passwordError } = this.state;

        if (!this.state.firstName) {
            firstNameError = "Please enter first name"
            isValid = false;
        } else {
            firstNameError = "";
        }

        if (!this.state.lastName) {
            lastNameError = "Please enter last name"
            isValid = false;
        } else {
            lastNameError = "";
        }

        if (!this.state.displayName) {
            displayNameError = "Please enter display name"
            isValid = false;
        } else {
            displayNameError = "";
        }

        if (!this.state.mobileNo) {
            mobileNoError = "Please enter a valid mobile number e.g 03001234567"
            isValid = false;
        } else {
            if (!this.state.mobileNo.startsWith("03") || this.state.mobileNo.split('').length !== 11) {
                mobileNoError = "Please enter a valid mobile number e.g 03001234567";
                isValid = false;
            } else {
                mobileNoError = ""
            }
        }

        if (!this.state.email) {
            emailError = "Please enter a valid email e.g name@domain.com"
            isValid = false;
        } else {
            regex = new RegExp(emailExp);
            if (!regex.test(this.state.email)) {
                emailError = "Please enter a valid email e.g name@domain.com"
                isValid = false;
            } else {
                emailError = ""
            }
        }

        if (!this.state.discipline) {
            disciplineError = "Please enter discipline"
            isValid = false;
        } else {
            disciplineError = "";
        }

        if (!this.state.jobStatusId) {
            jobStatusIdError = "Please select the job status"
            isValid = false;
        } else {
            jobStatusIdError = "";
        }

        // if (!this.state.address) {
        //     addressError = "Please enter present address"
        //     isValid = false;
        // } else {
        //     addressError = "";
        // }

        if (!this.state.password && this.state.recordId == 0) {
            passwordError = "Please enter temporary password"
            isValid = false;
        } else {
            passwordError = "";
        }

        this.setState({
            firstNameError, lastNameError, displayNameError, mobileNoError, emailError, disciplineError, jobStatusIdError,
            addressError, passwordError
        })

        return isValid;
    }

    clickOnFormSubmit = () => {
        if (this.isFormValid()) {
            document.getElementById('btn-submit').click();
        }
    }

    resetForm = () => {
        this.setState({
            showPass: false,

            firstName: "",
            firstNameError: "",
            lastName: "",
            lastNameError: "",
            displayName: "",
            displayNameError: "",
            mobileNo: "",
            mobileNoError: "",
            email: "",
            emailError: "",
            discipline: "",
            disciplineError: "",
            jobStatusId: "",
            jobStatusIdError: "",
            address: "",
            addressError: "",
            password: "",
            passwordError: "",
        })
    }

    getEmployeesJobStatusData = async () => {
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonEmployeesJobStatusTypesView`;
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
                        this.setState({
                            jobStatusIdData: json.DATA || []
                        })
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
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
                        console.log(error);
                        this.handleOpenSnackbar("Failed to Get Job Status Data ! Please try Again later.", "error");
                    }
                });
        this.setState({ isLoading: false })
    }

    onFormSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonUsersSave`;
        await fetch(url, {
            method: "POST",
            body: data,
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
                        this.handleOpenSnackbar(json.USER_MESSAGE, "success");
                        if (this.state.recordId == 0) {
                            this.resetForm();
                        } else {
                            setTimeout(() => {
                                window.location.replace('#/dashboard/employee-reports');
                            }, 1000);
                        }
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
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
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.", "error");
                    }
                });
        this.setState({ isLoading: false })
    }


    viewReport = () => {
        window.location = "#/dashboard/employee-reports";
    }

    handleClickShowPassword = () => {
        const { showPass } = this.state;
        this.setState({
            showPass: !showPass
        })
    };

    handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    render() {

        const { classes } = this.props;

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <form noValidate autoComplete="off" id="myForm" onSubmit={this.onFormSubmit}>
                    <TextField type="hidden" name="id" value={this.state.recordId} />
                    <Grid container component="main" className={classes.root}>
                        <Typography
                            style={{
                                color: '#1d5f98',
                                fontWeight: 600,
                                borderBottom: '1px solid #d2d2d2',
                                width: '98%',
                                marginBottom: 25,
                                fontSize: 20
                            }}
                            variant="h5"
                        >
                            Define Employee
                        </Typography>
                        <Divider style={{
                            backgroundColor: 'rgb(58, 127, 187)',
                            opacity: '0.3'
                        }}
                        />
                        <Grid
                            container
                            spacing={2}
                            style={{
                                marginLeft: 5,
                                marginRight: 15
                            }}
                        >

                            <Grid item xs={4}>
                                <TextField
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.firstName}
                                    error={this.state.firstNameError}
                                    helperText={this.state.firstNameError}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.lastName}
                                    error={this.state.lastNameError}
                                    helperText={this.state.lastNameError}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="displayName"
                                    name="displayName"
                                    label="Display Name"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.displayName}
                                    error={this.state.displayNameError}
                                    helperText={this.state.displayNameError}

                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="mobileNo"
                                    name="mobileNo"
                                    label="Mobile Number"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.mobileNo}
                                    helperText={this.state.mobileNoError}
                                    error={this.state.mobileNoError}
                                    inputProps={{
                                        maxLength: 11
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.email}
                                    helperText={this.state.emailError}
                                    error={this.state.emailError}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="discipline"
                                    name="discipline"
                                    label="Discipline"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.discipline}
                                    helperText={this.state.disciplineError}
                                    error={this.state.disciplineError}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="jobStatusId"
                                    name="jobStatusId"
                                    label="Job Status"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.jobStatusId}
                                    helperText={this.state.jobStatusIdError}
                                    error={this.state.jobStatusIdError}
                                    select
                                >
                                    {this.state.jobStatusIdData.map(item => {
                                        return (
                                            <MenuItem key={item.ID} value={item.ID}>
                                                {item.Label}
                                            </MenuItem>
                                        )
                                    })}

                                </TextField>
                            </Grid>
                            {/* <Grid item xs={4}>
                                <TextField
                                    id="address"
                                    name="address"
                                    label="Present Address"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.address}
                                    helperText={this.state.addressError}
                                    error={this.state.addressError}
                                />
                            </Grid> */}
                            <Grid item xs={4}>
                                <TextField
                                    id="password"
                                    name="password"
                                    label="Temporary Password"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    type={this.state.showPass ? "text" : "password"}
                                    onChange={this.onHandleChange}
                                    value={this.state.password}
                                    helperText={this.state.passwordError}
                                    error={this.state.passwordError}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => this.handleClickShowPassword()}
                                                    onMouseDown={this.handleMouseDownPassword}
                                                >
                                                    {this.state.showPass ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>

                                    }}
                                />
                            </Grid>
                            <DefineEmployeeRolesSection state={this.state} onHandleChange={e => this.onHandleChange(e)} />
                        </Grid>
                    </Grid>
                    <input type="submit" style={{ display: 'none' }} id="btn-submit" />
                </form>
                <BottomBar
                    left_button_text="View"
                    left_button_hide={false}
                    bottomLeftButtonAction={() => this.viewReport()}
                    right_button_text="Save"
                    bottomRightButtonAction={() => this.clickOnFormSubmit()}
                    loading={this.state.isLoading}
                    isDrawerOpen={this.props.isDrawerOpen}
                />
                <CustomizedSnackbar
                    isOpen={this.state.isOpenSnackbar}
                    message={this.state.snackbarMessage}
                    severity={this.state.snackbarSeverity}
                    handleCloseSnackbar={() => this.handleCloseSnackbar()}
                />
            </Fragment>
        );
    }
}

DefineEmployeeForm.propTypes = {
    isDrawerOpen: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    match: PropTypes.object

}

DefineEmployeeForm.defaultProps = {
    isDrawerOpen: true,
    match: {
        params: {
            recordId: 0
        }
    }
}



export default withStyles(styles)(DefineEmployeeForm);