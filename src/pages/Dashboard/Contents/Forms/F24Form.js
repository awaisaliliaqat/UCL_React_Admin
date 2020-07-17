import React, { Component, Fragment, useState, useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
import { TextField, Grid, CircularProgress, Typography, MenuItem, Divider, Checkbox, Chip, Hidden} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
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

function CourseRow (props) {

    const {rowIndex, rowData, prerequisiteCoursesArray, ...rest} = props;

    console.log("rowData", rowData);
    
    const [prerequisiteCourse, setPrerequisiteCourse] = useState([]);
    const [prerequisiteCoursesInputValue, setPrerequisiteCoursesInputValue] = useState("");
    
    const handlePrerequisiteCourse = (event, value, rason) => {
        setPrerequisiteCourse(value);
        let ObjArray = value;
        let selectedPCIdsString = "";
        for(let i=0; i<ObjArray.length; i++){
            if(i==0){
                selectedPCIdsString = ObjArray[i].ID;
            }else{
                selectedPCIdsString += ","+ObjArray[i].ID;
            }
        }
        setPrerequisiteCoursesInputValue(selectedPCIdsString);
    }

    const isPrerequisiteCourseSelected = (option) => {
        return prerequisiteCourse.some(selectedOption => selectedOption.ID == option.ID);
    }
    
    useEffect(()=>{  });

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return(
        <Fragment>
        <Grid item xs={12}></Grid>
        <Grid 
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
            spacing={2}
        >
            <Typography 
                color="primary" 
                variant="subtitle1"
                component="div"
                style={{float:"left"}}
            >
                <b>{rowIndex}:</b>
            </Typography>
            <Grid item xs={12} md={2}>
                <TextField
                    id="courseLabel"
                    name="courseLabel"
                    label="Course Label"
                    required
                    fullWidth
                    inputProps={{
                        "aria-readonly":true
                    }}
                    variant="outlined"
                    value={rowData.courseLabel}
                />
                <TextField 
                    type="hidden"
                    name="programmeCourseId"
                    value={rowData.ID}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <TextField
                    id="courseCredit"
                    name="courseCredit"
                    label="Course Credit"
                    required
                    fullWidth
                    inputProps={{
                        "aria-readonly":true
                    }}
                    variant="outlined"
                    value={rowData.courseCreditLabel}
                />
            </Grid>
            <Grid item xs={12} md={7}>
                <Autocomplete
                    multiple
                    fullWidth
                    id="checkboxes-tags-demo"
                    name="checkboxes-tags-demo"
                    options={prerequisiteCoursesArray}
                    value={prerequisiteCourse}
                    onChange={handlePrerequisiteCourse}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.Label}
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                            <Chip
                                label={option.Label}
                                color="primary"
                                variant="outlined"
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                    renderOption={(option) => (
                        <Fragment>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={ isPrerequisiteCourseSelected(option) }
                                color="primary"
                            />
                            {option.Label}
                        </Fragment>
                    )}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            variant="outlined" 
                            label="Prerequisite Courses" 
                            placeholder="Search and Select" 
                        />
                    )}
                />
            </Grid>
            <TextField 
                type="hidden"
                name="programmeCourseIdPrereq" 
                value={prerequisiteCoursesInputValue}
            />
        </Grid>
        </Fragment>
    );
}

class F24Form extends Component {

    constructor(props) { 
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading: false,
            isReload: false,
            isOpenSnackbar:false,
            snackbarMessage:"",
            snackbarSeverity:"",
            programmeGroupMenuItems:null,
            programmeGroupId:"",
            programmeGroupIdError:"",
            programmeGroupCoursesArray:null,
            prerequisiteCourseArray:[],
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

    loadProgrammeGroups = async() => {        
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C24CommonProgrammesView`;
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
                        this.setState({programmeGroupMenuItems:json.DATA});
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE,"error");
                    }
                    console.log("programmeGroupMenuItems",json);
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

    loadProgrammeGroupCourses = async(ProgrammeGroupId) => {       
        let data = new FormData();
        data.append("programmeGroupId",ProgrammeGroupId);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C24CommonProgrammeCoursesView`;
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
                       this.setState({programmeGroupCoursesArray:json.DATA});
                       let prerequisiteCourseArray = [];
                       for(let i=0; i<json.DATA.length; i++){
                            let obj = {
                                    ID:json.DATA[i].ID, 
                                    Label: json.DATA[i].courseId+" - "+json.DATA[i].courseCode+" - "+json.DATA[i].courseTitle
                            }
                            prerequisiteCourseArray.push(obj);
                       }
                       this.setState({prerequisiteCourseArray:prerequisiteCourseArray});
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE,"error");
                    }
                    console.log("loadProgrammeGroupCourses",json);
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
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C24CommonCoursePrerequisitesView`;
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
                       this.setState({
                           label:json.DATA[0].label,
                           shortLabel:json.DATA[0].shortLabel
                       });
                    } else {
                        //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
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
                       // alert("Failed to Save ! Please try Again later.");
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    isProgrammeGroupValid = () => {
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

    onHandleChange = e => {

        const { name, value } = e.target;
        const errName = `${name}Error`;
       
        this.setState({
            [name]: value,
            [errName]: ""
        });

        switch (name) {
            case "programmeGroupId":
                this.loadProgrammeGroupCourses(value);
                break;
            default:
                break;
        }

    }

    clickOnFormSubmit=()=>{
        this.onFormSubmit();
    }

     onFormSubmit = async(e) => {
        if(
            !this.isProgrammeGroupValid()
        ){ return; }
        let myForm = document.getElementById('myForm');
        const data = new FormData(myForm);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C24CommonCoursePrerequisitesSave`;
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
                                window.location="#/dashboard/F06Reports";
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
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    
    viewReport = () => {
        window.location = "#/dashboard/F24Reports";
    }

    componentDidMount() {
        this.loadProgrammeGroups();
        if(this.state.recordId!=0){
            this.loadData(this.state.recordId);
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match.params.recordId!=nextProps.match.params.recordId){
            if(nextProps.match.params.recordId!=0){
                this.loadData(nextProps.match.params.recordId);
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
                    <TextField type="hidden" name="recordId" value={this.state.recordId}/>
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
                            Define Course Prerequisite 
                        </Typography>
                        <Grid 
                            container 
                            spacing={2} 
                            style={{ 
                                marginLeft: 5, 
                                marginRight: 10 
                            }}
                        >
                            <Grid item xs={12}>
                                <TextField
                                    id="programmeGroupId"
                                    name="programmeGroupId"
                                    variant="outlined"
                                    label="Programme Group"
                                    onChange={this.onHandleChange}
                                    value={this.state.programmeGroupId}
                                    error={!!this.state.programmeGroupIdError}
                                    helperText={this.state.programmeGroupIdError}
                                    required
                                    fullWidth
                                    select
                                >
                                    {this.state.programmeGroupMenuItems ?
                                        this.state.programmeGroupMenuItems.map((dt, i) => (
                                            <MenuItem 
                                                key={"programmeGroupMenuItems"+dt.ID} 
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
                            <Grid item xs={12}>
                                <Divider 
                                    style={{
                                        backgroundColor: 'rgb(58, 127, 187)',
                                        opacity: '0.3'
                                    }} 
                                />
                            </Grid>
                            {this.state.programmeGroupCoursesArray ? 
                                this.state.programmeGroupCoursesArray.map((dt, i) => (
                                    <CourseRow 
                                        key={"programmeGroupCoursesArray"+i}
                                        rowIndex={++i}
                                        rowData={dt}
                                        prerequisiteCoursesArray={this.state.prerequisiteCourseArray}
                                    />
                                ))
                                :
                                this.state.isLoading ?
                                <Grid 
                                    container 
                                    justify="center" 
                                    alignContent="center"
                                    style={{padding:"1em"}}
                                >
                                    <CircularProgress />
                                </Grid>
                                :
                                ""
                            }
                        </Grid>
                        <br/>
                        <br/>
                        <br/>
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
export default withStyles(styles)(F24Form);