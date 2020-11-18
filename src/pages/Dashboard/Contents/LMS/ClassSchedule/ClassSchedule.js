import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import ClassScheduleFilter from './Chunks/ClassScheduleFilter';
import ClassScheduleTableComponent from './Chunks/ClassScheduleTableComponent';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import FilterIcon from "mdi-material-ui/FilterOutline";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ClassScheduleAction from './Chunks/ClassScheduleAction';
import { format } from 'date-fns';

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

class ClassSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            scheduleData: [],

            isOpenActionMenu: false,

            scheduleTimeData: [],
            classRoomsData: [],

            recordId: 0,
            scheduleDate: null,
            scheduleDateError: "",
            scheduleTime: "",
            scheduleTimeError: "",
            scheduleDuration: "",
            scheduleDurationError: "",
            scheduleRoomId: "",
            scheduleRoomObject: {},
            scheduleRoomObjectError: "",

            coursesData: [],
            courseId: "",
            classDate: new Date(),

            showTableFilter: false,

            isLoginMenu: false,
            isReload: false,

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: ""

        }
    }

    componentDidMount() {
        this.getData();
        this.getRoomsData();
        this.getCoursesData();
        this.getPreTimeSlotsMenuItems();
    }

    getData = async () => {
        this.setState({
            isLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C55CommonAcademicsTimeTableView?classDate=${format(this.state.classDate, "dd-MM-yyyy")}&courseId=${this.state.courseId}`;
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
                            scheduleData: json.DATA || []
                        })
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
                    }
                },
                error => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true
                        })
                    } else {
                        this.handleOpenSnackbar("Failed to Load Data, Please try again later", "error");
                        console.log(error);
                    }
                });
        this.setState({
            isLoading: false
        })


    }

    getRoomsData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C55CommonAcademicsScheduleClassRoomsView`;
        await fetch(url, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                (json) => {
                    if (json.CODE === 1) {
                        this.setState({ classRoomsData: json.DATA || [] });
                    } else {
                        this.handleOpenSnackbar(
                            json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
                            "error"
                        );
                    }
                },
                (error) => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true,
                        });
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar(
                            "Failed to fetch ! Please try Again later.",
                            "error"
                        );
                    }
                }
            );
    }

    getCoursesData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C55CommonProgrammeCoursesView`;
        await fetch(url, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                (json) => {
                    if (json.CODE === 1) {
                        this.setState({ coursesData: json.DATA || [] });
                    } else {
                        this.handleOpenSnackbar(
                            json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
                            "error"
                        );
                    }
                },
                (error) => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true,
                        });
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar(
                            "Failed to fetch ! Please try Again later.",
                            "error"
                        );
                    }
                }
            );
    }

    onFormSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            isLoading: true
        })
        const data = new FormData(e.target);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C55CommonAcademicsTimeTableSave`;
        await fetch(url, {
            method: "POST",
            body: data,
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                (json) => {
                    if (json.CODE === 1) {
                        this.handleOpenSnackbar(json.USER_MESSAGE, "success");
                        this.getData();
                        this.onHandleClose();
                    } else {
                        this.handleOpenSnackbar(
                            json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
                            "error"
                        );
                    }
                },
                (error) => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false,
                        });
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar(
                            "Failed to Save ! Please try Again later.",
                            "error"
                        );
                    }
                }
            );
        this.setState({ isLoading: false });
    }


    onClearFilters = () => {
        this.setState({
            classDate: new Date(),
            courseId: ""
        })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        const errName = `${name}Error`
        this.setState({
            [name]: value,
            [errName]: ""
        })
    }


    handleDateChange = (date, name) => {
        const errName = `${name}Error`;
        this.setState({
            [name]: date,
            [errName]: ""
        });
    }

    onAutoCompleteChange = (e, value, name) => {
        const objectName = `${name}Object`;
        const nameId = `${name}Id`;
        const objectNameError = `${name}ObjectError`
        let object = isEmpty(value) ? {} : value;
        this.setState({
            [objectName]: object,
            [nameId]: object.ID || "",
            [objectNameError]: ""
        })
    }

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenSnackbar: false
        });
    };

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar: true,
            snackbarMessage: msg,
            snackbarSeverity: severity
        });
    };

    handleToggleTableFilter = () => {
        this.setState({ showTableFilter: !this.state.showTableFilter });
    }

    onReschuduleClick = (rowData) => {


        const getDate = new Date(rowData.classDate).getDate();
        const newDate = new Date().getDate();
        let myDate = null;
        if (getDate !== newDate) {
            myDate = new Date(rowData.classDate);
        }

        this.setState({
            isOpenActionMenu: true,
            recordId: rowData.id,
            scheduleDate: myDate,
            scheduleTime: rowData.classTime,
            scheduleDuration: rowData.classDuration,
            scheduleRoomId: rowData.classRoomId,
            scheduleRoomObject: {
                ID: rowData.classRoomId,
                Label: rowData.classRoomLabel,
                studentCapacity: rowData.classRoomStudentCapacity
            },
        })
    }

    getPreTimeSlotsMenuItems = () => {
        var x = 15; //minutes interval
        var times = []; // time array
        var tt = 480; // start time 0 For 12 AM
        var ap = ["AM", "PM"]; // AM-PM

        //loop to increment the time and push results in array
        for (var i = 0; tt < 24 * 60; i++) {
            var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
            var mm = tt % 60; // getting minutes of the hour in 0-55 format
            times[i] =
                (`${hh % 12 === 0 ? '' : '0'}${hh % 12 === 0 ? '12' : hh % 12}`).slice(-2) +
                ":" +
                ("0" + mm).slice(-2) +
                " " +
                ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
            tt = tt + x;
            if (times[i] == "08:00 PM") {
                break;
            }
        }
        this.setState({ scheduleTimeData: times });
    };

    isFormValid = () => {
        let isValid = true;
        let { scheduleDateError, scheduleDurationError, scheduleRoomObjectError, scheduleTimeError } = this.state;

        if (!this.state.scheduleDate) {
            isValid = false;
            scheduleDateError = "Please select the date";
        } else {
            scheduleDateError = "";
        }

        if (!this.state.scheduleTime) {
            isValid = false;
            scheduleTimeError = "Please select a time";
        } else {
            scheduleTimeError = "";
        }

        if (!this.state.scheduleDuration) {
            isValid = false;
            scheduleDurationError = "Please enter valid durations in minuts";
        } else {
            scheduleDurationError = ""
        }

        if (isEmpty(this.state.scheduleRoomObject)) {
            isValid = false;
            scheduleRoomObjectError = "Please select a room";
        } else {
            scheduleRoomObjectError = ""
        }

        this.setState({
            scheduleDateError, scheduleDurationError, scheduleRoomObjectError, scheduleTimeError
        })

        return isValid;
    }

    onSaveClick = () => {
        if (this.isFormValid()) {
            document.getElementById("btnClassRescheduleSubmit").click();
        }
    }

    onHandleClose = () => {
        this.setState({
            isOpenActionMenu: false
        }, () => {
            this.resetValues();
        })
    }

    resetValues = () => {
        this.setState({
            recordId: 0,
            scheduleDate: null,
            scheduleDateError: "",
            scheduleTime: "",
            scheduleTimeError: "",
            scheduleDuration: "",
            scheduleDurationError: "",
            scheduleRoomId: "",
            scheduleRoomObject: {},
            scheduleRoomObjectError: ""
        })
    }

    render() {
        const columns = [
            { name: "sectionLabel", title: "Section" },
            { name: "sectionTypeLabel", title: "Section Type" },
            { name: "courseLabel", title: "Course Label" },
            { name: "classRoomLabel", title: "Class Room" },
            { name: "scheduledOn", title: "Class Schedule" },
            { name: "action", title: "Action", getCellValue: rowData => {
                    return (
                        <Fragment>
                            <Button 
                                onClick={() => this.onReschuduleClick(rowData)}
                                style={{ textTransform: 'capitalize' }} 
                                variant="outlined" 
                                color="primary"
                                disabled={!!rowData.isAllowedToReschedule}
                            >
                                Reschedule
                            </Button>
                        </Fragment>
                    )
                }
            }
        ]

        const classDateDob = this.state.scheduleDate ? format(this.state.scheduleDate, "dd-MM-yyyy") : null;

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <div style={{
                    padding: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                            Class Schedule
            </Typography>
                        <div style={{ float: "right" }}>
                            <Tooltip title="Table Filter">
                                <IconButton
                                    style={{ marginLeft: "-10px" }}
                                    onClick={() => this.handleToggleTableFilter()}
                                >
                                    <FilterIcon fontSize="default" color="primary" />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <ClassScheduleFilter onAutoCompleteChange={(e, value, name) => this.onAutoCompleteChange(e, value, name)} isLoading={this.state.isLoading} handleDateChange={this.handleDateChange} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={(sectionId) => this.getData(sectionId)} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div>
                    {this.state.reportTypeId !== 0 &&
                        <ClassScheduleTableComponent
                            rows={this.state.scheduleData}
                            columns={columns}
                            showFilter={this.state.showTableFilter}
                        />
                    }
                    <ClassScheduleAction open={this.state.isOpenActionMenu} values={this.state} handleClose={() => this.onHandleClose()}
                        handleDateChange={(date, name) => this.handleDateChange(date, name)} onHandleChange={this.onHandleChange}
                        onAutoCompleteChange={(e, value, name) => this.onAutoCompleteChange(e, value, name)}
                        onSaveClick={() => this.onSaveClick()}
                    />
                </div>
                <CustomizedSnackbar
                    isOpen={this.state.isOpenSnackbar}
                    message={this.state.snackbarMessage}
                    severity={this.state.snackbarSeverity}
                    handleCloseSnackbar={() => this.handleCloseSnackbar()}
                />
                <form onSubmit={this.onFormSubmit}>
                    <input type="hidden" name="id" value={this.state.recordId} />
                    <input type="hidden" name="classDate" value={classDateDob} />
                    <input type="hidden" name="startTime" value={this.state.scheduleTime} />
                    <input type="hidden" name="duration" value={this.state.scheduleDuration} />
                    <input type="hidden" name="classRoomId" value={this.state.scheduleRoomId} />

                    <input type="submit" id="btnClassRescheduleSubmit" style={{ display: 'none' }} />
                </form>
            </Fragment>
        );
    }
}
export default ClassSchedule;