import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import { TextField, Grid, Divider, Typography, MenuItem } from '@material-ui/core';
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import AssignSectionToStudentFormTableComponent from './Chunks/AssignSectionToStudentFormTableComponent';
import ScrollToTop from '../../../../../components/ScrollToTop/ScrollToTop';
import ExcelIcon from "../../../../../assets/Images/excel.png";

const styles = () => ({
    root: {
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
    },

});

class AssignSectionToStudentForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading: false,
            isReload: false,
            showPass: false,

            sessionId: "",
            sessionIdError: "",
            sessionData: [],
            programmeId: "",
            programmeIdError: "",
            programmesData: [],
            offeredCoursesId: "",
            offeredCoursesIdError: "",
            coursesData: [],

            assigneLectureSectionId: "",
            assigneLectureSectionData: [],

            assigneTutorialSectionId: "",
            assigneTutorialSectionData: [],

            isAssignError: "",

            studentsData: [],
            studentsDataError: [],

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",
            isDownloadExcel:false
        }
    }

    componentDidMount() {
        this.getSessionData();
    }

    getSectionsData = async (type, courseId) => {
        this.setState({ isLoading: true })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C28CommonAcademicsSectionsView?sessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}&courseId=${courseId}&sectionTypeId=${type}`;
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
                        const dataName = type === 1 ? 'assigneLectureSectionData' : 'assigneTutorialSectionData';
                        this.setState({
                            [dataName]: json.DATA || []
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

    getSessionData = async () => {
        this.setState({ isLoading: true })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C28CommonAcademicsSessionsView`;
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
                            sessionData: json.DATA || []
                        });
                        let selectedRow = json.DATA.find( data => data.isActive==1 );
                        if (selectedRow) {
                            this.setState({
                                sessionId: selectedRow.ID,
                                programmeId: "",
                                programmeIdError: "",
                                offeredCoursesId: "",
                                offeredCoursesIdError: "",
                            })
                            this.getprogrammesData(selectedRow.ID);
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

    getprogrammesData = async (id, pId = "") => {
        this.setState({ isLoading: true })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C28CommonAcademicsSessionsOfferedProgrammesView?sessionId=${id}`;
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
                            programmesData: json.DATA || [],
                            programmeId: pId
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

    getCoursesData = async (id, cId = "", sId = "") => {
        this.setState({ isLoading: true })
        const sessionId = sId || this.state.sessionId
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C28CommonAcademicsSessionsOfferedCoursesView?sessionId=${sessionId}&programmeGroupId=${id}`;
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
                            coursesData: json.DATA || [],
                            offeredCoursesId: cId
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

    getStudentsData = async (id) => {
        this.setState({ isLoading: true })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C28CommonStudentsView?sessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}&courseId=${id}`;
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
                        let data = json.DATA || [];
                        for (let i = 0; i < data.length; i++) {
                            data[i].isChecked = false;
                        }
                        this.setState({
                            studentsData: data,
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

    downloadExcelData = async () => {
        if(
            !this.state.sessionId || 
            !this.state.programmeId || 
            !this.state.offeredCoursesId || 
            !this.state.assigneLectureSectionId
        ) {
            this.handleOpenSnackbar("Session, Programme Group, Offered Course and Assigne Lecture Section are mandatory fields.", "error");
            return;
        }
        if (this.state.isDownloadExcel === false) {
            this.setState({isDownloadExcel: true});
            const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C28CommonAssignSectionToStudentsExcelDownload?sessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}&courseId=${this.state.offeredCoursesId}&sectionTypeId=${this.state.assigneLectureSectionId}`;
            await fetch(url, {
                method: "GET",
                headers: new Headers({
                    Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
                })
            })
                .then(res => {
                    if (res.status === 200) {
                        return res.blob();
                    }
                    return false;
                })
                .then(
                    json => {
                        if (json) {
                            var csvURL = window.URL.createObjectURL(json);
                            var tempLink = document.createElement("a");
                            tempLink.setAttribute("download", `Applications.xlsx`);
                            tempLink.href = csvURL;
                            tempLink.click();
                            console.log(json);
                        }
                    },
                    error => {
                        if (error.status === 401) {
                            this.setState({
                                isLoginMenu: true,
                                isReload: false
                            })
                        } else {
                            alert('Failed to fetch, Please try again later.');
                            console.log(error);
                        }
                    });
            this.setState({isDownloadExcel:false});
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

    onHandleChange = e => {
        const { name, value } = e.target;
        const errName = `${name}Error`;

        switch (name) {
            case "sessionId":
                this.setState({
                    programmeId: "",
                    programmeIdError: "",
                    offeredCoursesId: "",
                    offeredCoursesIdError: "",
                })
                this.getprogrammesData(value);
                break;
            case "programmeId":
                this.setState({
                    offeredCoursesId: "",
                    offeredCoursesIdError: "",
                })
                this.getCoursesData(value);
                break;
            case "offeredCoursesId":
                this.getStudentsData(value);
                this.getSectionsData(1, value);
                this.getSectionsData(2, value);
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
        let { sessionIdError, programmeIdError, offeredCoursesIdError, studentsDataError, isAssignError } = this.state;
        if (!this.state.sessionId) {
            isValid = false;
            sessionIdError = "Please select the session";
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } else {
            if (!this.state.programmeId) {
                isValid = false;
                programmeIdError = "Please select the programme";
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            } else {
                if (!this.state.offeredCoursesId) {
                    isValid = false;
                    offeredCoursesIdError = "Please select the offered course";
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                } else {
                    if (!this.state.assigneLectureSectionId && !this.state.assigneTutorialSectionId) {
                        isValid = false;
                        isAssignError = "Please select the section";
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                    }
                    const checkFilter = this.state.studentsData.filter(item => item.isChecked === true);
                    if (checkFilter.length <= 0) {
                        isValid = false;
                        studentsDataError = "Please select the student";
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                    }

                }
            }
        }

        this.setState({
            sessionIdError, programmeIdError, offeredCoursesIdError, studentsDataError, isAssignError
        })

        return isValid;

    }

    clickOnFormSubmit = () => {
        if (this.isFormValid()) {
            document.getElementById('assignToStudent').click();
        }
    }
    onFormSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C28CommonAcademicsSectionsStudentsSave`;
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
                            this.setState({
                                assigneLectureSectionId: "",
                                assigneLectureSectionIdError: "",
                                assigneTutorialSectionId: "",
                                assigneTutorialSectionIdError: "",
                            })
                            this.onAllClick(false);
                            this.getStudentsData(this.state.offeredCoursesId)

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
        window.location = "#/dashboard/assign-section-to-student-reports";
    }

    onCheckClick = (e, row = {}) => {
        const { checked } = e.target;
        let { studentsData } = this.state;
        const studentIndex = studentsData.findIndex(item => item.studentId === row.studentId);
        studentsData[studentIndex].isChecked = checked;
        this.setState({
            studentsData
        })

    }

    onAllClick = (bool) => {
        let { studentsData } = this.state;
        for (let i = 0; i < studentsData.length; i++) {
            studentsData[i].isChecked = bool;
        }
        this.setState({
            studentsData
        })
    }

    onFilterCheckClick = (type) => {
        let { studentsData } = this.state;
        for (let i = 0; i < studentsData.length; i++) {
            if (type === 1 && studentsData[i].isLectureSectionAssigned === 0) {
                studentsData[i].isChecked = true;
            } else {
                if (type === 2 && studentsData[i].isTutorialSectionAssigned === 0) {
                    studentsData[i].isChecked = true
                }
            }
        }
        this.setState({
            studentsData
        })
    }

    onClearAssignDropDown = () => {
        this.setState({
            assigneLectureSectionId: "",
            assigneLectureSectionIdError: "",
            assigneTutorialSectionId: "",
            assigneTutorialSectionIdError: "",

            sessionId: "",
            sessionIdError: "",
            programmeId: "",
            programmeIdError: "",
            programmesData: [],
            offeredCoursesId: "",
            offeredCoursesIdError: "",
            coursesData: [],

            isAssignError: "",

            studentsData: [],
            studentsDataError: [],



        })
    }

    render() {

        const { classes } = this.props;
        const columns = [
            {
                name: "isAssign", title: "Select", getCellValue: row => {
                    return (
                        <Checkbox
                            icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 30 }} />}
                            checkedIcon={<CheckBoxIcon style={{ fontSize: 30 }} />}
                            color="primary"
                            onChange={(e) => this.onCheckClick(e, row)}
                            checked={row.isChecked}
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    )
                }
            },
            { name: "studentId", title: "Nucleus Id" },
            {
                name: "firstName", title: "Student Name", getCellValue: row => {
                    return (
                        <Fragment>
                            {`${row.firstName} ${row.lastName}`}
                        </Fragment>
                    );
                }
            },
            { name: "programmeLabel", title: "Programme"},
            { name: "lectureSectionLabel", title: "Lecture Section" },
            { name: "tutorialSectionLabel", title: "Tutorial Section" },
        ]

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />

                <Grid container component="main" className={classes.root}>
                    <Typography
                        style={{
                            color: '#1d5f98',
                            fontWeight: 600,
                            borderBottom: '1px solid #d2d2d2',
                            width: '98%',
                            marginBottom: 15,
                            fontSize: 20
                        }}
                        variant="h5"
                    >
                        Assign Section to Students
                        <img 
                            alt="" 
                            src={ExcelIcon} 
                            onClick={() => this.downloadExcelData()} 
                            style={{
                                float:"right",
                                height: 30, 
                                width: 32,
                                cursor: `${this.state.isDownloadExcel ? 'wait' : 'pointer'}`,
                            }}
                        />
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
                                id="sessionId"
                                name="sessionId"
                                label="Session"
                                required
                                fullWidth
                                variant="outlined"
                                onChange={this.onHandleChange}
                                value={this.state.sessionId}
                                helperText={this.state.sessionIdError}
                                error={this.state.sessionIdError}
                                select
                            >
                                {this.state.sessionData.map(item => {
                                    return (
                                        <MenuItem key={item.ID} value={item.ID}>
                                            {item.Label}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                id="programmeId"
                                name="programmeId"
                                label="Programme Group"
                                required
                                fullWidth
                                variant="outlined"
                                disabled={!this.state.sessionId}
                                onChange={this.onHandleChange}
                                value={this.state.programmeId}
                                helperText={this.state.programmeIdError}
                                error={this.state.programmeIdError}
                                select
                            >
                                {this.state.programmesData.map(item => {
                                    return (
                                        <MenuItem key={item.Id} value={item.Id}>
                                            {item.Label}
                                        </MenuItem>
                                    )
                                })}

                            </TextField>
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                id="offeredCoursesId"
                                name="offeredCoursesId"
                                label="Offered Courses"
                                required
                                fullWidth
                                variant="outlined"
                                disabled={!this.state.programmeId}
                                onChange={this.onHandleChange}
                                value={this.state.offeredCoursesId}
                                helperText={this.state.offeredCoursesIdError}
                                error={this.state.offeredCoursesIdError}
                                select
                            >
                                {this.state.coursesData.map(item => {
                                    return (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.courseLabel}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Divider style={{
                        opacity: '0.8',
                        width: '98%',
                        marginTop: 15,
                        marginBottom: 15
                    }}
                    />
                    <div style={{
                        display: 'flex',
                        width: '98%'
                    }}>
                        <Button color="primary" disabled={!this.state.sessionId || !this.state.programmeId || !this.state.offeredCoursesId}
                            style={{
                                marginRight: 10,
                                textTransform: 'capitalize'
                            }} variant="outlined" onClick={() => this.onAllClick(true)}>
                            Select All
                                </Button>
                        <Button color="primary" disabled={!this.state.sessionId || !this.state.programmeId || !this.state.offeredCoursesId}
                            style={{
                                marginRight: 10,
                                textTransform: 'capitalize'
                            }} variant="outlined" onClick={() => this.onFilterCheckClick(1)}>
                            Select All Pending Lecture Section Students
                                </Button>
                        <Button color="primary" disabled={!this.state.sessionId || !this.state.programmeId || !this.state.offeredCoursesId}
                            style={{
                                marginRight: 10,
                                textTransform: 'capitalize'
                            }} variant="outlined" onClick={() => this.onFilterCheckClick(2)}>
                            Select All Pending Tutorial Section Students
                                </Button>
                        <Button color="primary" disabled={!this.state.sessionId || !this.state.programmeId || !this.state.offeredCoursesId}
                            style={{
                                marginRight: 10,
                                textTransform: 'capitalize'
                            }} variant="outlined" onClick={() => this.onAllClick(false)}>
                            Clear Selection
                                </Button>

                    </div>
                    <Divider style={{
                        opacity: '0.8',
                        width: '98%',
                        marginBottom: 15,
                        marginTop: 15
                    }}
                    />
                    <Grid
                        container
                        spacing={2}
                        style={{
                            marginLeft: 5,
                            marginRight: 15,
                            justifyContent: 'flex-end'
                        }}
                    >
                        <Grid item xs={4}>
                            <TextField
                                id="assigneLectureSectionId"
                                name="assigneLectureSectionId"
                                label="Assign Lecture Section"
                                required
                                fullWidth
                                variant="outlined"
                                disabled={!this.state.sessionId || !this.state.programmeId || !this.state.offeredCoursesId}
                                onChange={this.onHandleChange}
                                value={this.state.assigneLectureSectionId}
                                select
                            >
                                {this.state.assigneLectureSectionData.map(item => {
                                    return (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.label}
                                        </MenuItem>
                                    )
                                })}

                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                id="assigneTutorialSectionId"
                                name="assigneTutorialSectionId"
                                label="Assigne Tutorial Section"
                                required
                                fullWidth
                                variant="outlined"
                                disabled={!this.state.sessionId || !this.state.programmeId || !this.state.offeredCoursesId}
                                onChange={this.onHandleChange}
                                value={this.state.assigneTutorialSectionId}
                                select
                            >
                                {this.state.assigneTutorialSectionData.map(item => {
                                    return (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.label}
                                        </MenuItem>
                                    )
                                })}

                            </TextField>
                        </Grid>
                        {/* <Grid item xs={1}>
                            <Button color="primary" disabled={!this.state.sessionId || !this.state.programmeId || !this.state.offeredCoursesId}
                                style={{
                                    padding: 10,
                                    width: 85,
                                    marginTop: 5,
                                    textTransform: 'capitalize'
                                }} variant="outlined" onClick={() => this.onClearAssignDropDown()}>
                                Clear
                                </Button>
                        </Grid> */}
                    </Grid>
                    <div style={{
                        textAlign: 'center',
                        width: '100%',
                        marginTop: 20,
                        color: '#fd1f1f'
                    }}>{this.state.isAssignError}</div>
                    <Divider style={{
                        opacity: '0.8',
                        width: '98%',
                        marginBottom: 15,
                    }}
                    />
                    <div style={{
                        textAlign: 'center',
                        width: '100%',
                        marginTop: 20,
                        color: '#fd1f1f'
                    }}>{this.state.sectionDataError}</div>
                    <div style={{
                        marginBottom: 40
                    }}>
                        <AssignSectionToStudentFormTableComponent
                            rows={this.state.studentsData}
                            columns={columns}
                            showFilter={false}
                        />
                    </div>
                </Grid>

                <BottomBar
                    left_button_text="View"
                    left_button_hide={true}
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
                <form id="myForm" onSubmit={this.onFormSubmit}>
                    <input type="hidden" name="id" value={this.state.recordId} />
                    <input type="hidden" name="courseId" value={this.state.offeredCoursesId} />
                    <input type="hidden" name="lectureSectionId" value={this.state.assigneLectureSectionId} />
                    <input type="hidden" name="tutorialSectionId" value={this.state.assigneTutorialSectionId} />
                    {this.state.studentsData.map(item => {
                        if (item.isChecked) {
                            return (
                                <Fragment key={item.id}>
                                    <input type="hidden" name="studentId" value={item.id} />
                                </Fragment>
                            );
                        }
                    })}
                    <input type="submit" style={{ display: 'none' }} id="assignToStudent" />
                </form>
                <ScrollToTop />
            </Fragment>
        );
    }
}

AssignSectionToStudentForm.propTypes = {
    isDrawerOpen: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    match: PropTypes.object

}

AssignSectionToStudentForm.defaultProps = {
    isDrawerOpen: true,
    match: {
        params: {
            recordId: 0
        }
    }
}



export default withStyles(styles)(AssignSectionToStudentForm);