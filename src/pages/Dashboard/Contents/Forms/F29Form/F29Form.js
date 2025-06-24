import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import { TextField, Grid, Divider, Typography, MenuItem, IconButton } from '@material-ui/core';
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import PropTypes from "prop-types";
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import AssignSectionToTeacherFormTableComponent from './Chunks/AssignSectionToTeacherFormTableComponent';
import ScrollToTop from '../../../../../components/ScrollToTop/ScrollToTop';
import AssignSectionToTeacherFormDialog from './Chunks/AssignSectionToTeacherFormDialog';
import { Delete } from '@material-ui/icons';

const styles = () => ({
    root: {
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
    },

});


function isEmpty(obj) {
    if (obj == null) return true;

    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    if (typeof obj !== "object") return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
}

class AssignSectionToTeacherForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading: false,
            isReload: false,
            showPass: false,
            isMenuOpen: false,

            sessionId: "",
            sessionIdError: "",
            sessionData: [],
            programmeId: "",
            programmeIdError: "",
            programmesData: [],
            offeredCoursesId: "",
            offeredCoursesIdError: "",
            coursesData: [],

            mainData: [],

            selectionDataError: "",

            teachersData: [],
            teachersObject: {},
            teacherId: "",
            teachersObjectError: "",

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

    getSessionData = async () => {
        this.setState({ isLoading: true })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C29CommonAcademicsSessionsView`;
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
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C29CommonAcademicsSessionsOfferedProgrammesView?sessionId=${id}`;
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
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C29CommonAcademicsSessionsOfferedCoursesView?sessionId=${sessionId}&programmeGroupId=${id}`;
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

    getData = async (id) => {
        this.setState({ isLoading: true })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C29CommonAcademicsSectionsView?sessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}&courseId=${id}`;
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
                            let data = json.DATA || [];
                            for (let i = 0; i < data.length; i++) {
                                data[i].isChecked = false;
                            }
                            this.setState({
                                mainData: data
                            });
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

    getTeachersData = async (id) => {
        this.setState({ isLoading: true })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C29CommonUsersView?sessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}&courseId=${id}`;
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
                            teachersData: json.DATA || []
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
                            isReload: false
                        })
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar("Failed to Load Data ! Please try Again later.", "error");
                    }
                });
        this.setState({ isLoading: false })
    }

    isFormValid = () => {
        let isValid = true;
        let { sessionIdError, programmeIdError, offeredCoursesIdError, selectionDataError } = this.state;
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
                    const checkFilter = this.state.mainData.filter(item => item.isChecked === true);
                    if (checkFilter.length <= 0) {
                        isValid = false;
                        selectionDataError = "Please select any record";
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                    }
                }
            }
        }

        this.setState({
            sessionIdError, programmeIdError, offeredCoursesIdError, selectionDataError
        })

        return isValid;

    }

    clickOnFormSubmit = () => {
        if (this.isFormValid()) {
            this.setState({
                isMenuOpen: true
            })
        }
    }

    onFormSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C29CommonAcademicsSectionsTeachersSave`;
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
                        this.setState({
                            teachersObject: {},
                            teacherId: "",
                            isMenuOpen: false
                        })
                        this.getData(this.state.offeredCoursesId);
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

    onDeleteSubmit = async (e, id) => {
        e.preventDefault();
        const data = new FormData();
        data.append("id", id);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C29CommonAcademicsSectionsTeachersDelete`;
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
                        this.getData(this.state.offeredCoursesId);
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
        window.location = "#/dashboard/F29Reports";
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
                this.getData(value);
                this.getTeachersData(value);
                break;
            default:
                break;
        }

        this.setState({
            [name]: value,
            [errName]: ""
        })
    }

    onAutoCompleteChange = (e, value) => {
        let object = isEmpty(value) ? {} : value;
        this.setState({
            teachersObject: object,
            teacherId: object.id || "",
            teachersObjectError: ""
        })
    }

    onCheckClick = (e, row = {}) => {
        const { checked } = e.target;
        let { mainData } = this.state;
        const studentIndex = mainData.findIndex(item => item.id === row.id);
        mainData[studentIndex].isChecked = checked;
        this.setState({
            mainData,
            selectionDataError: ""
        })

    }

    onSaveClick = () => {
        let { teachersObjectError } = this.state;
        if (!this.state.teacherId) {
            teachersObjectError = "Please select the teacher";
        } else {
            document.getElementById('assignToTeacher').click();
        }

        this.setState({
            teachersObjectError
        })
    }

    componentDidMount() {
        this.props.setDrawerOpen(false);
        this.getSessionData();
    }

    render() {

        const { classes } = this.props;
        const columns = [
            {
                name: "isAssign", title: "Select", getCellValue: row => {
                    console.log(row);
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
            { name: "courseLabel", title: "Course Label" },
            { name: "sectionTypeLabel", title: "Class Type" },
            { name: "label", title: "Section" },
            { name: "assignedOn", title: "Assigned Date" },
            { name: "teacherName", title: "Teacher Name" },
            { name: "teacherContact", title: "Teacher Contact" },
            { name: "action", title: "Action", getCellValue: row => {
                return(
                    <IconButton onClick={(e) => this.onDeleteSubmit(e, row.teacherSectionId)} disabled={row.isSectionAssigned != 1} color='secondary'>
                        <Delete />
                    </IconButton>
                )
            } },
        ]
        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <AssignSectionToTeacherFormDialog isLoading={this.state.isLoading} onAutoCompleteChange={this.onAutoCompleteChange} onConfirmClick={() => this.onSaveClick()} open={this.state.isMenuOpen} data={this.state} handleClose={() => this.setState({ isMenuOpen: false })} />
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
                        Assign Section to Teacher
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
                    <div style={{
                        textAlign: 'center',
                        width: '100%',
                        marginTop: 20,
                        color: '#fd1f1f'
                    }}>{this.state.selectionDataError}</div>
                    <Divider style={{
                        opacity: '0.8',
                        width: '98%',
                        marginTop: 15,
                        marginBottom: 15
                    }} />
                    <div style={{
                        marginBottom: 40
                    }}>
                        <AssignSectionToTeacherFormTableComponent
                            rows={this.state.mainData}
                            columns={columns}
                            showFilter={false}
                        />
                    </div>
                </Grid>

                <BottomBar
                    leftButtonText="View"
                    leftButtonHide={true}
                    bottomLeftButtonAction={() => this.viewReport()}
                    right_button_text="Assign Teacher"
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
                    <input type="hidden" name="teacherId" value={this.state.teacherId} />

                    {this.state.mainData.map(item => {
                        if (item.isChecked) {
                            return (
                                <Fragment key={item.id}>
                                    <input type="hidden" name="sectionId" value={item.id} />
                                </Fragment>
                            );
                        }
                    })}

                    <input type="submit" style={{ display: 'none' }} id="assignToTeacher" />
                </form>
                <ScrollToTop />
            </Fragment >
        );
    }
}

AssignSectionToTeacherForm.propTypes = {
    isDrawerOpen: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    match: PropTypes.object

}

AssignSectionToTeacherForm.defaultProps = {
    isDrawerOpen: true,
    match: {
        params: {
            recordId: 0
        }
    }
}



export default withStyles(styles)(AssignSectionToTeacherForm);