import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import TimeSheetFilter from './Chunks/TimeSheetFilter';
import TimeSheetTableComponent from './Chunks/TimeSheetTableComponent';
import LoginMenu from '../../../../../../components/LoginMenu/LoginMenu';
import CustomizedSnackbar from "../../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import FilterIcon from "mdi-material-ui/FilterOutline";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
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

class MonthWiseTeachersTimeSheetReports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            attendanceData: [],

            selectedData: {},

            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            toDate: new Date(),


            teacherId: "",
            teacherObject: {},
            teacherObjectError: "",
            teacherData: [],

            showTableFilter: false,

            isLoginMenu: false,
            isReload: false,

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",
            monthsMenuItems: [
                {id:1, label:"January"},
                {id:2, label:"February"},
                {id:3, label:"March"},
                {id:4, label:"April"},
                {id:5, label:"May"},
                {id:6, label:"June"},
                {id:7, label:"July"},
                {id:8, label:"August"},
                {id:9, label:"September"},
                {id:10, label:"October"},
                {id:11, label:"November"},
                {id:12, label:"December"}
              ],
              monthId: "",
              coursesMenuItems: [],
              courseId: "",
              courseIdError: "",
              
              sectionsMenuItems: [],
              sectionId: "",
              sectionIdError:"",

        }
    }

    componentDidMount() {
        this.getTeachersData();
    }

    getTeachersData = async () => {
        this.setState({ isLoading: true })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C44CommonUsersView`;
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
                            teacherData: json.DATA || []
                        });
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


    getCourses = async (sessionId) => {
        let data = new FormData();
        
        data.append("sessionId", sessionId);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C64CommonAcademicsSectionCoursesView`;
        await fetch(url, {
          body:data,
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
                this.setState({coursesMenuItems: json.DATA || []});
              } else {
                //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
                this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
              }
              console.log("getCourses", json);
            },
            (error) => {
              if (error.status === 401) {
                this.setState({
                  isLoginMenu: true,
                  isReload: true,
                });
              } else {
                //alert('Failed to fetch, Please try again later.');
                this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
                console.log(error);
              }
            }
          );
        this.setState({isLoading: false});
      };
    
      getSections = async (courseId) => {
        let data = new FormData();
        data.append("teacherId", courseId);
        // data.append("sessionId", this.state.academicSessionId);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C301CommonAcademicsSectionsTeachersView`;
        await fetch(url, {
          method: "POST",
          body:data,
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
                this.setState({sectionsMenuItems: json.DATA || []});
              } else {
                //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
                this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
              }
              console.log("getSections", json);
            },
            (error) => {
              if (error.status === 401) {
                this.setState({
                  isLoginMenu: true,
                  isReload: false,
                });
              } else {
                //alert('Failed to fetch, Please try again later.');
                this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
                console.log(error);
              }
            }
          );
        this.setState({isLoading: false});
      };


    getData = async (teacherId) => {
        this.setState({
            isLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C44CommonAcademicsAttendanceTeachersLogView?fromDate=${format(this.state.fromDate, "dd-MM-yyyy")}&toDate=${format(this.state.toDate, "dd-MM-yyyy")}&teacherId=${teacherId}`;
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

    onAutoCompleteChange = (e, value) => {
        let object = isEmpty(value) ? {} : value;
        this.setState({
            teacherObject: object,
            teacherId: object.id || "",
            teacherObjectError: ""
        })
        if (object.id) {
            this.getData(object.id);
        }
    }


    onClearFilters = () => {

        this.setState({
            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            toDate: new Date(),
            attendanceData: [],
            teacherId: "",
            teacherObject: {},
            teacherObjectError: ""
        })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        switch (name) {
            case "sectionTypeId":
                this.setState({
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
            { name: "teacherEmail", title: "Teacher Email" },
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
                            Month Wise Teacher's Timesheet Report
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
                    <TimeSheetFilter onAutoCompleteChange={(e, value) => this.onAutoCompleteChange(e, value)} isLoading={this.state.isLoading} handleDateChange={this.handleDateChange} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={(sectionId) => this.getData(sectionId)} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div>
                    {this.state.reportTypeId !== 0 &&
                        <TimeSheetTableComponent
                            rows={this.state.attendanceData}
                            columns={columns}
                            showFilter={this.state.showTableFilter}
                        />
                    }
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
export default MonthWiseTeachersTimeSheetReports;