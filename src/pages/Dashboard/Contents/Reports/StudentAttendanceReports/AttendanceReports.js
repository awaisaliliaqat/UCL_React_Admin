import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography";
import AttendanceFilter from './Chunks/AttendanceFilter';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import FilterIcon from "mdi-material-ui/FilterOutline";
import AttendanceTableComponent from './Chunks/AttendanceTableComponent';
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

class AttendanceReports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            attendanceData: [],

            selectedData: {},

            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            toDate: new Date(),

            showTableFilter: false,

            sectionTypeId: 0,
            sectionTypeData: [],
            sectionId: 0,
            sectionObject: {},
            sectionIdError: "",
            sectionData: [],

            isLoginMenu: false,
            isReload: false,

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",
            totalStudents: []

        }
    }

    componentDidMount() {
        this.getSectionTypeData();
    }

    getSectionTypeData = async () => {
        this.setState({
            isLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C43CommonAcademicsSectionTypesView`;
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
                            sectionTypeData: json.DATA || []
                        })
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
                    }
                    console.log(json);
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

    getSectionData = async (sectionTypeId) => {
        this.setState({
            isLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C43CommonAcademicsSectionsView?sectionTypeId=${sectionTypeId}`;
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
                            sectionData: json.DATA || []
                        })
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
                    }
                    console.log(json);
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

    getData = async (sectionId) => {
        this.setState({
            isLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C43CommonAcademicsAttendanceStudentsLogView?fromDate=${format(this.state.fromDate, "dd-MM-yyyy")}&toDate=${format(this.state.toDate, "dd-MM-yyyy")}&sectionId=${sectionId}`;
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
                            attendanceData: json.DATA || []
                        })
                        let totalStudents = this.state.attendanceData.length;
                        this.setState({totalStudents: totalStudents});
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
                    }
                    console.log(json);
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


    onClearFilters = () => {

        this.setState({
            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            toDate: new Date(),
            sectionTypeId: 0,
            attendanceData: [],
            sectionData: [],
            sectionId: 0,
            sectionObject: {}
        })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        switch (name) {
            case "sectionTypeId":
                this.setState({
                    sectionObject: {},
                    sectionId: 0,
                    sectionData: [],
                    attendanceData: []
                })
                this.getSectionData(value);
                break;
            default:
                break;
        }
        this.setState({
            [name]: value
        })
    }


    handleDateChange = (date, name) => {
        this.setState({
            [name]: date
        });
    }

    handleAutocompleteChange = (e, object, name) => {
        const nameId = `${name}Id`;
        const nameObject = `${name}Object`;
        const nameError = `${nameId}Error`;
        let objId = ""; let obj = {};
        if (!isEmpty(object)) {
            switch (name) {
                case "section":
                    this.getData(object.id);
                    break;
                default:
                    break;
            }
            objId = object.id;
            obj = object;
        }
        this.setState({
            [nameId]: objId,
            [nameObject]: obj,
            [nameError]: "",
            attendanceData: []
        });
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

    render() {

        const columns = [
            { name: "studentId", title: "Nucleus Id" },
            { name: "studentName", title: "Student Name" },
            { name: "sectionLabel", title: "Section" },
            { name: "sectionTypeLabel", title: "Section Type" },
            { name: "courseId", title: "Course Id" },
            { name: "courseLabel", title: "Course Label" },
            { name: "startTimestamp", title: "Class Schedule" },
            { name: "joinedOn", title: "Joined On" },
            {
                name: "lateMinutes", title: "Late Minutes", getCellValue: rowData => {
                    return (
                        <Fragment>
                            {rowData.lateMinutes > 0 ? rowData.lateMinutes : ""}
                        </Fragment>
                    );
                }
            },
            {
                name: "isPresent", title: "Status", getCellValue: rowData => {
                    return (
                        <Fragment>
                            <span style={{
                                fontWeight: 600,
                                color: `${rowData.isPresent === 0 ? '#d26161' : 'rgb(28 126 96)'}`
                            }}> {rowData.isPresent === 0 ? 'Absent' : 'Present'} </span>

                        </Fragment>
                    )
                }
            }
        ]

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
                            Attendance Reports
                            {this.state.totalStudents>1? 
                         <Typography
                           style={{
                              color: "#1d5f98",
                              fontWeight: 600,
                              textTransform: "capitalize",
                              textAlign: "left"
                                  }}
                              variant="subtitle1"
                          >
                              Total Students: {this.state.totalStudents}
                          </Typography>
                          :
                          ""
                          }
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
                    <AttendanceFilter handleAutocompleteChange={(e, object, name) => this.handleAutocompleteChange(e, object, name)} isLoading={this.state.isLoading} handleDateChange={this.handleDateChange} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={(sectionId) => this.getData(sectionId)} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div>
                    <AttendanceTableComponent
                        rows={this.state.attendanceData}
                        columns={columns}
                        showFilter={this.state.showTableFilter}
                    />
                </div>
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
export default AttendanceReports;