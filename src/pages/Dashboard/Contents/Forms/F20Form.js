import React, { Component, Fragment } from 'react';
import { withStyles} from '@material-ui/styles';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
import { TextField, Grid, Divider, Typography, MenuItem, CircularProgress} from '@material-ui/core';
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

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

class F20Form extends Component {

    constructor(props) { 
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading: false,
            isReload: false,
            isOpenSnackbar:false,
            snackbarMessage:"",
            snackbarSeverity:"",
            courseId:"",
            courseIdError:"",
            courseCode:"",
            courseCodeError:"",
            courseCreditId:"",
            courseCreditIdError:"",
            courseCreditIdMenuItems:null,
            courseTitle:"",
            courseTitleError:"",
            isCourseLabelAutoChangeable:true,
            courseLabel:"",
            courseLabelError:"",
            academicsSessionIdMenuItems:null,
            academicsSessionId:"",
            academicsSessionIdError:"",
            programmeMenuItems:null,
            programmeGroupId:"",
            programmeGroupIdError:"",
            courseRowDataArray:[]
        }
    }

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar:true,
            snackbarMessage:msg,
            snackbarSeverity:severity
        });
    };

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenSnackbar:false
        });
    };

    loadAcademicSession = async() => {        
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C20CommonAcademicSessionsView`;
        await fetch(url, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
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
                       this.setState({academicsSessionIdMenuItems:json.DATA});
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE,"error");
                    }
                    console.log("loadAcademicSession",json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar("Failed to fetch ! Please try again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    loadProgrammes = async() => {        
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C20CommonProgrammeGroupsView`;
        await fetch(url, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
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
                        this.setState({programmeMenuItems:json.DATA});
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE,"error");
                    }
                    console.log("programmeMenuItems",json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar("Failed to fetch ! Please try again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    loadCourseCredit = async() => {        
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C20CommonProgrammeCoursesCreditTypeView`;
        await fetch(url, {
            method: "POST",
            headers: new Headers({
                Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
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
                        this.setState({courseCreditIdMenuItems:json.DATA});
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE,"error");
                    }
                    console.log("courseCreditIdMenuItems",json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar("Failed to fetch ! Please try again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    loadData = async(index) => {
        const data = new FormData();
        data.append("id",index);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C20CommonProgrammeCoursesView`;
        await fetch(url, {
            method: "POST",
            body: data, 
            headers: new Headers({
                Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
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
                        console.log("loadData", json);
                        if(json.DATA.length){
                            this.setState({
                                academicsSessionId:json.DATA[0].academicsSessionId,
                                programmeGroupId:json.DATA[0].programmeGroupId,
                                courseCreditId:json.DATA[0].courseCreditId,
                                courseId:json.DATA[0].courseLabel,
                                courseCode:json.DATA[0].courseCode,
                                courseTitle:json.DATA[0].courseTitle,
                                courseLabel:json.DATA[0].courseLabel
                            });
                        }else{
                            this.setState({recordId:0});
                            window.location = "#/dashboard/F20Form/"+this.state.recordId;
                        }
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE,"error");
                    }
                    console.log("loadData", json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        console.log(error);
                       // alert("Failed to Save ! Please try Again later.");
                        this.handleOpenSnackbar("Failed to fetch ! Please try again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    isAcademicSessionValid = () => {
        let isValid = true;
        if (!this.state.academicsSessionId) {
            this.setState({academicsSessionIdError:"Please select academic session."});
            document.getElementById("academicsSessionId").focus();
            isValid = false;
        } else {
            this.setState({academicsSessionIdError:""});
        }
        return isValid;
    }

    isProgrammeValid = () => {
        let isValid = true;
        if (!this.state.programmeGroupId) {
            this.setState({programmeGroupIdError:"Please select programme group."});
            document.getElementById("programmeGroupId").focus();
            isValid = false;
        } else {
            this.setState({programmeGroupIdError:""});
        }
        return isValid;
    }

    isCourseIdValid = () => {
        let isValid = true;        
        if (!this.state.courseId) {
            this.setState({courseIdError:"Please enter course id."});
            document.getElementById("courseId").focus();
            isValid = false;
        } else {
            this.setState({courseIdError:""});
        }
        return isValid;
    }

    isCourseCodeValid = () => {
        let isValid = true;        
        if (!this.state.courseCode) {
            this.setState({courseCodeError:"Please enter course code."});
            document.getElementById("courseCode").focus();
            isValid = false;
        } else {
            this.setState({courseCodeError:""});
        }
        return isValid;
    }

    isCourseTitleValid = () => {
        let isValid = true;
        if (!this.state.courseTitle) {
            this.setState({courseTitleError:"Please enter course title."});
            document.getElementById("courseTitle").focus();
            isValid = false;
        } else {
            this.setState({courseTitleError:""});
        }
        return isValid;
    }

    isCourseCreditValid = () => {
        let isValid = true;
        if (!this.state.courseCreditId) {
            this.setState({courseCreditIdError:"Please select course credit."});
            document.getElementById("courseCreditId").focus();
            isValid = false;
        } else {
            this.setState({courseCreditIdError:""});
        }
        return isValid;
    }

    isCourseLabelValid = () => {
        let isValid = true;
        if (!this.state.courseLabel) {
            this.setState({courseLabelError:"Please enter label."});
            document.getElementById("courseLabel").focus();
            isValid = false;
        } else {
            this.setState({courseLabelError:""});
        }
        return isValid;
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        const errName = `${name}Error`;
        switch (name) {
            case "courseLabel":
                this.setState({isCourseLabelAutoChangeable:false});
                break;
            default:
                break;
        }

        this.setState({
            [name]: value,
            [errName]: ""
        });

        switch (name) {
            case "academicsSessionId":
                this.loadProgrammes();
                break;
            default:
                break;
        }

        if(this.state.isCourseLabelAutoChangeable){
            let CID = document.getElementById("courseId").value;
            let CTitle = document.getElementById("courseTitle").value;
            this.state.courseLabel = CID+" - "+CTitle;
        }
    }

    clickOnFormSubmit=()=>{
        this.onFormSubmit();
    }

     onFormSubmit = async(e) => {
        if( 
            //!this.isAcademicSessionValid() ||
            !this.isProgrammeValid() ||
            !this.isCourseIdValid() ||
            !this.isCourseCodeValid() ||
            !this.isCourseTitleValid() ||
            !this.isCourseCreditValid() ||
            !this.isCourseLabelValid()
        ){ return; }
        let myForm = document.getElementById('myForm');
        const data = new FormData(myForm);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C20CommonProgrammeCoursesSave`;
        await fetch(url, {
            method: "POST", 
            body: data, 
            headers: new Headers({
                Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
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
                        this.handleOpenSnackbar(json.USER_MESSAGE,"success");
                        setTimeout(()=>{
                            if(this.state.recordId!=0){
                                window.location="#/dashboard/F20Reports";
                            }else{
                                window.location.reload();
                            }
                        }, 2000);
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE,"error");
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
                        //alert("Failed to Save ! Please try Again later.");
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    
    viewReport = () => {
        window.location = "#/dashboard/F20Reports";
    }

    componentDidMount() {
        //this.loadAcademicSession();
        this.loadProgrammes();
        this.loadCourseCredit();
        if(this.state.recordId!=0){
            this.loadData(this.state.recordId);
            this.setState({isCourseLabelAutoChangeable:false});
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match.params.recordId!=nextProps.match.params.recordId){
            if(nextProps.match.params.recordId!=0){
                this.loadData(nextProps.match.params.recordId);
                this.setState({isCourseLabelAutoChangeable:false});
            }else{
                window.location.reload();
            }
        }
    }

    render() {

        const { classes } = this.props;

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <form id="myForm" onSubmit={this.isFormValid}>
                    <TextField type="hidden" name="id" value={this.state.recordId}/>
                    <Grid container component="main" className={classes.root}>
                        <Typography 
                            style={{
                                color: '#1d5f98', 
                                fontWeight: 600, 
                                borderBottom: '1px solid rgb(58, 127, 187, 0.3)',
                                width: '98%', 
                                marginBottom: 25, 
                                fontSize: 20
                            }} 
                            variant="h5"
                        >
                            Define Programme Courses
                        </Typography>
                        <Grid 
                            container 
                            spacing={2} 
                            style={{ 
                                marginLeft: 5, 
                                marginRight: 10 
                            }}
                        >
                            {/* 
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="academicsSessionId"
                                    name="academicsSessionId"
                                    variant="outlined"
                                    label="Academic Session"
                                    onChange={this.onHandleChange}
                                    value={this.state.academicsSessionId}
                                    error={!!this.state.academicsSessionIdError}
                                    helperText={this.state.academicsSessionIdError}
                                    required
                                    fullWidth
                                    select
                                >
                                    {this.state.academicsSessionIdMenuItems ?
                                        this.state.academicsSessionIdMenuItems.map((dt, i) => (
                                            <MenuItem 
                                                key={"academicsSessionIdMenuItems"+dt.ID} 
                                                value={dt.ID}
                                            >
                                                {dt.Label}
                                            </MenuItem>
                                        ))
                                        :
                                        <MenuItem>
                                            <CircularProgress/>
                                        </MenuItem>
                                    }
                                </TextField>
                            </Grid> 
                            */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="programmeGroupId"
                                    name="programmeGroupId"
                                    variant="outlined"
                                    label="Programme Group"
                                    onChange={this.onHandleChange}
                                    value={this.state.programmeGroupId}
                                    error={!!this.state.programmeGroupIdError}
                                    helperText={this.state.programmeGroupIdError}
                                    //disabled={!this.state.academicsSessionId}
                                    required
                                    fullWidth
                                    select
                                >
                                    {this.state.programmeMenuItems ?
                                        this.state.programmeMenuItems.map((dt, i) => (
                                            <MenuItem 
                                                key={"programmeGroupIdMenuItems"+dt.ID} 
                                                value={dt.ID}
                                            >
                                                {dt.Label}
                                            </MenuItem>
                                        ))
                                        :
                                        <MenuItem>
                                            <CircularProgress size={24}/>
                                        </MenuItem>
                                    }
                                </TextField>
                            </Grid>
                            {/* 
                            <Grid item xs={12}>
                                <Divider 
                                    style={{
                                        backgroundColor: 'rgb(58, 127, 187)',
                                        opacity: '0.3'
                                    }} 
                                />
                            </Grid> 
                            */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="courseId"
                                    name="courseId"
                                    label="Course ID"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.courseId}
                                    error={!!this.state.courseIdError}
                                    helperText={this.state.courseIdError}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="courseCode"
                                    name="courseCode"
                                    label="Course Code"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.courseCode}
                                    error={!!this.state.courseCodeError}
                                    helperText={this.state.courseCodeError}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="courseTitle"
                                    name="courseTitle"
                                    label="Course Title"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.courseTitle}
                                    error={!!this.state.courseTitleError}
                                    helperText={this.state.courseTitleError}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="courseCreditId"
                                    name="courseCreditId"
                                    variant="outlined"
                                    label="Course Credit"
                                    onChange={this.onHandleChange}
                                    value={this.state.courseCreditId}
                                    error={!!this.state.courseCreditIdError}
                                    helperText={this.state.courseCreditIdError}
                                    required
                                    fullWidth
                                    select
                                >
                                    {this.state.courseCreditIdMenuItems ?
                                        this.state.courseCreditIdMenuItems.map((dt, i) => (
                                            <MenuItem 
                                                key={"courseCreditIdMenuItems"+dt.ID} 
                                                value={dt.ID}
                                            >
                                                {dt.Label}
                                            </MenuItem>
                                        ))
                                        :
                                        <MenuItem>
                                            <CircularProgress size={24}/>
                                        </MenuItem>
                                    }
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="courseLabel"
                                    name="courseLabel"
                                    label="Label"
                                    required
                                    fullWidth
                                    onChange={this.onHandleChange}
                                    variant="outlined"
                                    value={this.state.courseLabel}
                                    error={!!this.state.courseLabelError}
                                    helperText={this.state.courseLabelError!=""?this.state.courseLabelError:<Typography color="primary" variant="caption">Auto generated before change.</Typography>}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
                <BottomBar
                    left_button_text="View"
                    left_button_hide={false}
                    bottomLeftButtonAction={this.viewReport}
                    right_button_text="Save"
                    bottomRightButtonAction={this.clickOnFormSubmit}
                    loading={this.state.isLoading}
                    isDrawerOpen={ this.props.isDrawerOpen}
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
export default withStyles(styles)(F20Form);