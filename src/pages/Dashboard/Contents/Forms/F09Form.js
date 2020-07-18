import React, { Component, Fragment, useState, useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
//import { alphabetExp, numberExp, emailExp } from '../../../../utils/regularExpression';
import { TextField, Grid, MenuItem, FormControl, FormLabel, FormGroup, FormControlLabel,
    Checkbox, Card, CardContent, FormHelperText, CircularProgress, Divider, Typography, Chip} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const styles = () => ({
    root: {
        padding: 20,
        minWidth: 350,
        overFlowX: "auto"
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
    
    const [prerequisiteCourse, setPrerequisiteCourse] = useState([{ID:1,Label: "Label 1"},{ID:2,Label: "Label 2"}]);
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
            <Grid item xs={12} md={3}>
                <Autocomplete
                    fullWidth
                    id="checkboxes-tags-demo"
                    name="checkboxes-tags-demo"
                    options={prerequisiteCoursesArray}
                    // value={prerequisiteCourse}
                    // onChange={handlePrerequisiteCourse}
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
                    renderOption={(option, {selected}) => (
                        <Fragment>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={ selected }
                                color="primary"
                            />
                            {option.Label}
                        </Fragment>
                    )}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            variant="outlined" 
                            label="Courses Label" 
                            placeholder="Search and Select" 
                        />
                    )}
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={2}>
                <TextField
                    id="academicSessionId1"
                    name="academicSessionId1"
                    variant="outlined"
                    label="Choice Group"
                    // onChange={this.onHandleChange}
                    // value={this.state.academicSessionId}
                    // error={!!this.state.academicSessionIdError}
                    // helperText={this.state.academicSessionIdError}
                    required
                    fullWidth
                    select
                >
                    {[{ID:1,Label: "Label 1"},{ID:2,Label: "Label 2"}, {ID:3,Label: "Label 3"}].map((dt, i) => (
                        <MenuItem 
                            key={"academicSessionIdMenuItems"+dt.ID} 
                            value={dt.ID}
                        >
                            {dt.Label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
        </Grid>
        </Fragment>
    );
}

function ProgrammesCheckBox(props) {
   
    const [isChecked, setIsChecked] = useState(props.isChecked);

    const handleChecked = () => {
        setIsChecked(!isChecked);
        props.removeProgrammeCoursesError();
    }

    return (
        <Grid 
            item 
            md={3}
        >
            <FormControlLabel
                control={
                    <Checkbox 
                        checked={isChecked} 
                        onChange={handleChecked} 
                        name="programmeCourseId" 
                        color="primary" 
                        value={props.id}
                    />}
                label={props.label}
                style={{
                    color:'#1d5f98', 
                    fontWeight:600,
                    marginBottom:5, 
                    fontSize:12,
                    wordBreak: "break-word"
                }}
            />
        </Grid>
    );
}

class F09Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading: false,
            isReload: false,
            label:"",
            labelError:"",
            shortLabel:"",
            shortLabelError:"",
            isOpenSnackbar:false,
            snackbarMessage:"",
            snackbarSeverity:"",
            academicSessionIdMenuItems:[],
            academicSessionId:"",
            academicSessionIdError:"",
            programmeCoursesArray:[],
            programmeCoursesArraySelected:null,
            programmeCoursesError:"",

            prerequisiteCourseArray:[]
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
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonAcademicSessionsView`;
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
                       this.setState({academicSessionIdMenuItems:json.DATA});
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
                        this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    
    loadProgrammeCourses = async() => {        
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonProgrammeCoursesView`;
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
                       this.setState({programmeCoursesArray:json.DATA});
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE,"error");
                    }
                    console.log("loadProgrammeCourses", json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    loadData = async(index) => {
        const data = new FormData();
        data.append("id",index);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonCourseSelectionGroupView`;
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
                           academicSessionId : json.DATA[0].academicSessionId,
                           label : json.DATA[0].label,
                           shortLabel : json.DATA[0].shortLabel,
                           programmeCoursesArraySelected : json.DATA[0].programmeCourseId
                       });
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
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    isAcademicSessionValid = () => {
        let isValid = true;
        if (!this.state.academicSessionId) {
            this.setState({academicSessionIdError:"Please select Academic Session."});
            document.getElementById("academicSessionId").focus();
            isValid = false;
        } else {
            this.setState({academicSessionIdError:""});
        }
        return isValid;
    }
    
    islabelValid = () => {
        let isValid = true;
        if (!this.state.label) {
            this.setState({labelError:"Please enter Course Selection Group."});
            document.getElementById("label").focus();
            isValid = false;
        } else {
            this.setState({labelError:""});
        }
        return isValid;
    }

    isshortLabelValid = () => {
        let isValid = true;        
        if (!this.state.shortLabel) {
            this.setState({shortLabelError:"Please enter Short Name."});
            document.getElementById("shortLabel").focus();
            isValid = false;
        } else {
            this.setState({shortLabelError:""});
        }
        return isValid;
    }

    isProgrammeCoursesValid = () => {
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        var checkedOne = Array.prototype.slice.call(checkboxes).some(x => x.checked);
        let isValid = true;
        if (!checkedOne) {
            this.setState({programmeCoursesError:"Please select at least one Programme Course."});
            isValid = false;
        } 
        return isValid;
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        const errName = `${name}Error`;
        //let regex = "";
        // switch (name) {
        //     case "label":
        //     case "shortLabel":
        //         regex = new RegExp(alphabetExp);
        //         if (value && !regex.test(value)) {
        //             return;
        //         }
        //         break;
        // default:
        //     break;
        // }
        this.setState({
            [name]: value,
            [errName]: ""
        })
    }

    clickOnFormSubmit=()=>{
        this.onFormSubmit();
    }

     onFormSubmit = async(e) => {
        if(
            !this.isAcademicSessionValid () ||
            !this.islabelValid() || 
            !this.isshortLabelValid() ||
            !this.isProgrammeCoursesValid()
        ){ return; }
        let myForm = document.getElementById('myForm');
        const data = new FormData(myForm);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonCourseSelectionGroupSave`;
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
                                window.location="#/dashboard/F09Reports";
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

    removeProgrammeCoursesError = () => {
        this.setState({programmeCoursesError:""});
    }

    checkProgrammeCourseIsSelected = (val) => {
        let array = this.state.programmeCoursesArraySelected;
        if(array){
            return array.some(arrVal => val === arrVal);
        }
    }
    
    viewReport = () => {
        window.location = "#/dashboard/F09Reports"; 
    }

    componentDidMount() {
        this.loadAcademicSession();
        this.loadProgrammeCourses();
        
        let prerequisiteCourseArray = [];
        for(let i=0; i<4; i++){
            let obj = {
                    ID:++i, 
                    Label: "Label"+(++i)
            }
            prerequisiteCourseArray.push(obj);
        }
        this.setState({prerequisiteCourseArray:prerequisiteCourseArray});

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
                                borderBottom: '1px solid #d2d2d2',
                                width: '98%', 
                                marginBottom: 25, 
                                fontSize: 20
                            }} 
                            variant="h5"
                        >
                            Define Course Selection Group
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
                            <Grid item xs={12}>
                                <TextField
                                    id="academicSessionId"
                                    name="academicSessionId"
                                    variant="outlined"
                                    label="Academic Session"
                                    onChange={this.onHandleChange}
                                    value={this.state.academicSessionId}
                                    error={!!this.state.academicSessionIdError}
                                    helperText={this.state.academicSessionIdError}
                                    required
                                    fullWidth
                                    select
                                >
                                    {this.state.academicSessionIdMenuItems.map((dt, i) => (
                                        <MenuItem 
                                            key={"academicSessionIdMenuItems"+dt.ID} 
                                            value={dt.ID}
                                        >
                                            {dt.Label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="label"
                                    name="label"
                                    label="Course Selection Group"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onKeyDown={this.StopEnter}
                                    onChange={this.onHandleChange}
                                    value={this.state.label}
                                    error={!!this.state.labelError}
                                    helperText={this.state.labelError}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="shortLabel"
                                    name="shortLabel"
                                    label="Short Name"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onKeyDown={this.StopEnter}
                                    onChange={this.onHandleChange}
                                    value={this.state.shortLabel}
                                    error={!!this.state.shortLabelError}
                                    helperText={this.state.shortLabelError}
                                />
                            </Grid>
                            {this.state.programmeGroupCoursesArray||true ? 
                                [1,2].map((dt, i) => (
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
                            {/*
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <FormControl
                                            component="fieldset" 
                                            className={classes.formControl}
                                            required 
                                            error={!!this.state.programmeCoursesError}
                                        >
                                            <FormLabel 
                                                component="legend" 
                                                style={{
                                                    marginBottom:"0.5em"
                                                }}
                                            >
                                                Programme Courses
                                            </FormLabel>
                                            <FormGroup>
                                                <Grid 
                                                    container
                                                    direction="row"
                                                    justify="flex-start"
                                                    alignItems="center"
                                                >
                                                {this.state.programmeCoursesArraySelected ?
                                                    this.state.programmeCoursesArray.map( (dt, i) => (
                                                        <ProgrammesCheckBox 
                                                            key={"programmeCoursesArray"+i} 
                                                            id={dt.ID}
                                                            label={dt.Label}
                                                            isChecked={this.checkProgrammeCourseIsSelected(dt.ID)}
                                                            removeProgrammeCoursesError={this.removeProgrammeCoursesError}
                                                        />
                                                    ))
                                                    :
                                                    this.state.programmeCoursesArray.map( (dt, i) => (
                                                        <ProgrammesCheckBox 
                                                            key={"programmeCoursesArray2"+i} 
                                                            id={dt.ID}
                                                            label={dt.Label}
                                                            isChecked={false}
                                                            removeProgrammeCoursesError={this.removeProgrammeCoursesError}
                                                        />
                                                    
                                                    ))
                                                }
                                                </Grid>
                                            </FormGroup>
                                            <FormHelperText>{this.state.programmeCoursesError}</FormHelperText>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Grid>
                         */}
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
                    isDrawerOpen={ this.props.isDrawerOpen }
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
export default withStyles(styles)(F09Form);