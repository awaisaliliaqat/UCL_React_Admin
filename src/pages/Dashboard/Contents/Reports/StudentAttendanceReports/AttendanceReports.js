import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import AttendanceFilter from './Chunks/AttendanceFilter';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { format } from 'date-fns';

class AttendanceReports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            attendanceData: [],

            selectedData: {},

            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            toDate: new Date(),

            sectionTypeId: 0,
            sectionTypeData: [],
            sectionId: 0,
            sectionData: [],

            isLoginMenu: false,
            isReload: false,

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: ""

        }
    }

    componentDidMount() {
        this.getSectionTypeData();
    }

    getSectionTypeData = async () => {
        this.setState({
            isLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C38CommonAcademicsSectionTypesView`;
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
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C38CommonAcademicsSectionsView?sectionTypeId=${sectionTypeId}`;
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
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C38CommonAcademicsAttendanceStudentsLogView?fromDate=${format(this.state.fromDate, "dd-MM-yyyy")}&toDate=${format(this.state.toDate, "dd-MM-yyyy")}&sectionId=${sectionId}`;
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


    onClearFilters = () => {

        this.setState({
            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            toDate: new Date(),
            reportTypeId: 0,
            sectionTypeId: 0,
            sectionData: [],
            sectionId: 0
        })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        switch (name) {
            case "reportTypeId":
                this.setState({
                    sectionTypeId: 0,
                    sectionId: 0,
                    sectionData: [],
                    attendanceData: []
                })
                break;
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

    render() {

        const studentsColumns = [
            { name: "Nucleus Id", dataIndex: "studentId", sortIndex: "studentId", sortable: true, customStyleHeader: { width: '13%' } },
            { name: "Student Name", dataIndex: "studentName", sortIndex: "studentName", sortable: true, customStyleHeader: { width: '15%' } },
            { name: "Section", dataIndex: "sectionLabel", sortIndex: "sectionLabel", sortable: true, customStyleHeader: { width: '15%' } },
            { name: "Section Type", dataIndex: "sectionTypeLabel", sortIndex: "sectionTypeLabel", sortable: true, customStyleHeader: { width: '15%' } },
            { name: "Course Id", dataIndex: "courseId", sortable: false, customStyleHeader: { width: '12%' } },
            { name: "Course Label", dataIndex: "courseLabel", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Class Schedule", dataIndex: "startTimestamp", sortIndex: "startTimestampSimple", sortable: true, customStyleHeader: { width: '15%' } },
            { name: "Joined On", dataIndex: "joinedOn", sortable: false, customStyleHeader: { width: '15%' } },
            {
                name: "Status", renderer: rowData => {
                    return (
                        <Fragment>
                            <span style={{
                                fontWeight: 600,
                                color: `${rowData.isPresent === 0 ? '#d26161' : 'rgb(28 126 96)'}`
                            }}> {rowData.isPresent === 0 ? 'Absent' : 'Present'} </span>

                        </Fragment>
                    )
                }, sortIndex: "isPresent", sortable: true, customStyleHeader: { width: '10%' }
            },
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
            </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <AttendanceFilter isLoading={this.state.isLoading} handleDateChange={this.handleDateChange} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={(sectionId) => this.getData(sectionId)} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div>
                    {this.state.reportTypeId !== 0 &&
                        <TablePanel isShowIndexColumn data={this.state.attendanceData} isLoading={this.state.isLoading} sortingEnabled columns={studentsColumns} />
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
export default AttendanceReports;