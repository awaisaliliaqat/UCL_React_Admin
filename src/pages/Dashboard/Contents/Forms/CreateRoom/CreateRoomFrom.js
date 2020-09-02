import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import { TextField, Grid, Divider, Typography } from '@material-ui/core';
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const styles = () => ({
    root: {
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 0,
    },
});

class CreateRoomFrom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            label: "",
            labelError: "",
            studentCapacity: 0,
            studentCapacityError: "",

            isLoading: false,

            isLoginMenu: false,
            isReload: false,

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: ""
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
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C51CommonAcademicsScheduleClassRoomsView`;
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
                        if (json.DATA.length) {
                            this.setState({
                                label: json.DATA[0].Label,
                                studentCapacity: json.DATA[0].studentCapacity
                            });
                        } else {
                            setTimeout(
                                () => this.viewReport(), 1500);
                        }
                    } else {
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE, "error");
                        setTimeout(
                            () => this.viewReport(), 1500);
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

    isFormValid = () => {
        let isValid = true;
        let { labelError, studentCapacityError } = this.state;

        if (!this.state.label) {
            isValid = false;
            labelError = "Please enter name"
        } else {
            labelError = "";
        }

        if (!this.state.studentCapacity) {
            isValid = false;
            studentCapacityError = "Please enter room capacity"
        } else {
            if (this.state.studentCapacity <= 0) {
                isValid = false;
                studentCapacityError = "Please enter valid capacity"
            } else {
                studentCapacityError = ""
            }
        }

        this.setState({
            labelError,
            studentCapacityError
        })

        return isValid;
    }

    clickOnFormSubmit = () => {
        if (this.isFormValid()) {
            document.getElementById("btnRoomsSubmit").click();
        }
    }

    onFormSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C51CommonAcademicsScheduleClassRoomsSave`;
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

                        if (this.state.recordId != 0) {
                            setTimeout(() => {
                                window.location = "#/dashboard/create-room-reports";
                            }, 2000);
                        } else {
                            this.setState({
                                label: "",
                                labelError: "",
                                studentCapacity: 0,
                                studentCapacityError: "",
                            })
                        }

                    } else {
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE, "error");
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
        window.location = "#/dashboard/create-room-reports";
    }

    componentDidMount() {
        this.props.setDrawerOpen(false);
        if (this.state.recordId != 0) {
            this.loadData(this.state.recordId);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.match.params.recordId != nextProps.match.params.recordId) {
            if (nextProps.match.params.recordId != 0) {
                this.props.setDrawerOpen(false);
                this.loadData(nextProps.match.params.recordId);
                this.setState({
                    recordId: nextProps.match.params.recordId
                })
            } else {
                window.location.reload();
            }
        }
    }

    onHandleChange = (e) => {
        const { name, value } = e.target;
        const errName = `${name}Error`;

        this.setState({
            [name]: value,
            [errName]: ""
        })
    }

    render() {

        const { classes } = this.props;

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <form id="myForm" onSubmit={this.onFormSubmit}>
                    <TextField type="hidden" name="recordId" value={this.state.recordId} />
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
                            Maintain Rooms
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
                                marginRight: 10
                            }}
                        >
                            <Grid item xs={6}>
                                <TextField
                                    id="label"
                                    name="label"
                                    label="Label"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.label}
                                    error={this.state.labelError}
                                    helperText={this.state.label ? this.state.labelError : ""}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="studentCapacity"
                                    name="studentCapacity"
                                    label="Student Capacity"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    onChange={this.onHandleChange}
                                    value={this.state.studentCapacity || ""}
                                    error={this.state.studentCapacityError}
                                    helperText={this.state.studentCapacity ? this.state.studentCapacityError : ""}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <input type="submit" id="btnRoomsSubmit" style={{ display: 'none' }} />
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
CreateRoomFrom.propTypes = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.object,
    isDrawerOpen: PropTypes.bool,
    setDrawerOpen: PropTypes.func
}
CreateRoomFrom.defaultProps = {
    match: {
        params: {
            recordId: 0
        }
    },
    isDrawerOpen: false,
    setDrawerOpen: fn => fn
}
export default withStyles(styles)(CreateRoomFrom);