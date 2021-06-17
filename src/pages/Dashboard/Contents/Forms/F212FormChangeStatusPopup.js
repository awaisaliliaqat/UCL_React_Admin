import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField, Grid, MenuItem, CircularProgress, Divider, Typography, Button,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, useMediaQuery, Chip, Checkbox} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import CardMedia from '@material-ui/core/CardMedia';
import ProfilePlaceholder from '../../../../assets/Images/ProfilePlaceholder.png';

const styles = (theme) => ({
  
});

class F212FormChangeStatusPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: 0,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      popupBoxOpen: false,
      studentId: "",
      studentInfo: "",
      slectedAcademicSessionId: "",
      slectedprogrammeId: "",
      programmeSelectedCourses: "",
      courseIds: "",
      courseMenuItems: [],
      courseCreditId: [],
      courseCreditIds: "",
      courseCreditIdError: "",
      course: "",
      courseCompletionStatusId: "",
      endYearAchievementId: "",
      examEntryStatusIdValue: ''
    };
  }

  handleClickOpen = () => {
    this.setState({ popupBoxOpen: true });
  };

  handleClose = () => {
    this.props.handleClose();
  };
  handleDropDown = (event) => {
    this.setState({examEntryStatusIdValue: event.target.value});
  };
  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  getStudentDetail = async (studentId=0) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("studentId", studentId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonStudentsDetailView`;
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
            this.setState({ studentId: json.DATA || [] });
            let studentInfo = json.DATA[0]|| "";
              this.setState({studentInfo:studentInfo});
              // console.log("Student Info"+this.state.studentId);
              // console.log("Props"+this.props);
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
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
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };
  loadProgrammeCoursesSelction = async (slectedAcademicSessionId=0, programmeGroupId=0, studentId=0) => {
   
   
    let data = new FormData();
    data.append("academicsSessionId", slectedAcademicSessionId);
    data.append("programmeGroupId", programmeGroupId);
    data.append("studentId", studentId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonProgrammeCoursesSelectionView`;
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
            let data = json.DATA || [];
            this.setState({ courseCreditId:  []});
            this.setState({ courseMenuItems: json.DATA || []});
             }else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("loadProgrammeCoursesSelction", json);
          
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };
  
  // isCourseValid = () => {
  //   let courseCreditId = this.state.courseCreditId;
  //   let isValid = true;
  //   if (courseCreditId.length == 0 ) {
  //     this.setState({ courseCreditIdError: "Please select at least one feature." });
  //     document.getElementById("courseIds").focus();
  //     isValid = false;
  //   }else {
  //     this.setState({ courseCreditIdError: "" });
  //   }
  //   return isValid;
  // };


  courseSelected = (option) => {
    return this.state.courseCreditId.some((selectedOption) => selectedOption.ID == option.ID);
  };

  handleSetcourseCreditId = (value) => {
    console.log(value);
    this.setState({
      courseCreditId: value,
      courseCreditIdError: "",
    });
    let courseCreditIds = "";
    if(value){
      let course = value || []; 
      let arrLength = value.length || 0;
      for(let i=0; i<arrLength; i++){
        if(i==0){
          courseCreditIds = course[i].ID;
        }else{
          courseCreditIds+= ","+course[i].ID;
        }    
      }
      this.setState({courseCreditIds:courseCreditIds});
    }
    console.log(value);
  };

  componentDidMount() {
    this.setState({popupBoxOpen: this.props.isOpen});
  }

  componentDidUpdate(prevProps){
    // Typical usage (don't forget to compare props):
    if (this.props.isOpen !== prevProps.isOpen) {
      this.getStudentDetail(this.props.data.studentId);
      this.loadProgrammeCoursesSelction(this.props.slectedAcademicSessionId, this.props.data.programmeGroupId, this.props.data.studentId);
      this.setState({popupBoxOpen: this.props.isOpen});
      // console.log("Props");
      // console.log(this.props.data);
    }

  }

  render() {

    const { 
      
      classes, 
      data, 
      applicationStatusMenuItems=[], 
      renewalStatusMenuItems=[],
      courseCompletionStatusMenuItems=[],
      // endYearAchievementMenuItems=[], 
      examEntryStatusMenuItems=[],
      pathwayMenuItems=[],
      isLoading,
      onFormSubmit
    } = this.props;
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
        <Dialog
          fullScreen={true}
          open={this.state.popupBoxOpen}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <span style={{ color: "#ffffff" }}>
            ______________________________________________________________________________________________________________________
          </span>
          <DialogTitle id="responsive-dialog-title">
            <IconButton
              aria-label="close"
              onClick={this.handleClose}
              style={{
                position: "relative",
                top: "-35px",
                right: "-24px",
                float: "right",
              }}
            >
              <CloseOutlinedIcon color="secondary" />
            </IconButton>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: "bold",
                borderBottom: "0"
              }}
              variant= "h5"
            >
              Enrollment Status
            </Typography>
             
            <Grid container
                justify="flex-start"
                alignItems="center"
                spacing={2}
                style={{borderBottom: "1px solid rgb(58, 127, 187, 0.3)"}}
                >
                  <Grid item xs={3}>
                  <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                fontSize: 18
              }}
            >
              {"Student ID: "+data.studentNucleusId}
            </Typography>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {"Student Name: "+data.studentName}
            </Typography>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {"Date Of Birth: "+ this.state.studentInfo.dateOfBirth}
            </Typography>
                  </Grid>
                  <Grid item xs={3}>
                  <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {"Gender: "+ this.state.studentInfo.gender}
            </Typography>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {"CNIC: "+ this.state.studentInfo.cnic}
            </Typography>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {"Mobile Number: "+ this.state.studentInfo.mobileNo}
            </Typography>
                  </Grid>
                  <Grid item xs={3}>
                  <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {"Email: "+ this.state.studentInfo.email}
            </Typography>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {"Blood Group: "+ this.state.studentInfo.bloodGroup}
            </Typography>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {"Degree: "+ this.state.studentInfo.degree}
            </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    {this.state.studentInfo.imageName==null?
                    <img src={ProfilePlaceholder} 
                    style={{
                      width: 140,
                      height: 160,
                      border: "1px solid rgb(58, 127, 187, 0.3)",
                      margin: 10,
                      float: "right"
                    }}  />
                    : 
                 <CardMedia
                className={classes.image}
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonImageView?fileName=${this.state.studentInfo.imageName})`,
                  width: 140,
                  height: 160,
                  border: "1px solid rgb(58, 127, 187, 0.3)",
                  margin: 10,
                  float: "right"
                  }}
                  title="Student Profile"
                  />
                }
                  </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <form id="changeStatusForm" name="changeStatusForm">
              <Grid
                container
                justify="flex-start"
                alignItems="center"
                spacing={2}
              >
                <TextField
                  type="hidden"
                  id="studentId"
                  name="studentId"
                  defaultValue={data.studentId}
                />
                <Grid item xs={12} md={4}>
                  <TextField
                    name="applicationStatusId"
                    variant="outlined"
                    label="Application Status"
                    defaultValue={data.applicationStatusId || ""}
                    fullWidth
                    select
                    inputProps={{
                      id:"applicationStatusId"
                    }}
                  >
                    {applicationStatusMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"applicationStatusMenuItems"+dt.id}
                          value={dt.id}
                        >
                          {dt.label}
                        </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="renewalStatusId"
                    variant="outlined"
                    label="Renewal Status"
                    defaultValue={data.renewalStatusId || ""}
                    fullWidth
                    select
                    inputProps={{
                      id:"renewalStatusId"
                    }}
                  >
                    {renewalStatusMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"renewalStatusId"+dt.id}
                          value={dt.id}
                        >
                          {dt.label}
                        </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    name="pathwayId"
                    variant="outlined"
                    label="Pathway"
                    defaultValue={data.pathwayId || ""}
                    fullWidth
                    select
                    inputProps={{
                      id:"pathwayId"
                    }}
                  >
                    {pathwayMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"pathwayMenuItems"+dt.id}
                          value={dt.id}
                        >
                          {dt.label}
                        </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {/* Start */}
                <Grid item xs={6} md={6}>
                    
                  <TextField
                    name="courseCompletionStatusId"
                    variant="outlined"
                    label="Course Completion Status"
                    defaultValue={data.courseCompletionStatusId || ""}
                    fullWidth
                    select
                    inputProps={{
                      id:"courseCompletionStatusId"
                    }}
                  >
                    {courseCompletionStatusMenuItems.map((dt, i) => (
                    
                        <MenuItem
                          key={"courseCompletionStatusMenuItems"+dt.id}
                          value={dt.id}
                        >
                          {dt.label}
                        </MenuItem>
                    ))}
                  </TextField>
                  
                </Grid>
                {/* <Grid item xs={6} md={6}>
                    
                  <TextField
                    name="endYearAchievementId"
                    variant="outlined"
                    label="Year End Achievement"
                    defaultValue={data.endYearAchievementId || ""}
                    fullWidth
                    select
                    inputProps={{
                      id:"endYearAchievementId"
                    }}
                  >
                    {endYearAchievementMenuItems.map((dt, i) => (
                    
                        <MenuItem
                          key={"endYearAchievementMenuItems"+dt.id}
                          value={dt.id}
                        >
                          {dt.label}
                        </MenuItem>
                    ))}
                  </TextField>
                  
                </Grid> */}
                {/* End */}
                    <Grid item xs={6} md={3}>
                    
                  <TextField
                    name="examEntryStatusId"
                    variant="outlined"
                    label="Exam Entry Status"
                    defaultValue={data.examEntryStatusId || ""}
                    onChange={this.handleDropDown}
                    fullWidth
                    select
                    inputProps={{
                      id:"examEntryStatusId"
                    }}
                  >
                    {examEntryStatusMenuItems.map((dt, i) => (
                    
                        <MenuItem
                          key={"examEntryStatusMenuItems"+dt.id}
                          value={dt.id}
                        >
                          {dt.label}
                        </MenuItem>
                    ))}
                  </TextField>
                  
                </Grid>
                {  this.state.examEntryStatusIdValue==2 ||data.examEntryStatusId==2?
                <Grid item md={2}>
                <TextField
                    id="candidateNo"
                    name="candidateNo"
                    variant="outlined"
                    label="Candidate No"
                    defaultValue={data.candidateNo || ""}
                    fullWidth
                  />
                </Grid>
                :
                ""
                 }
                
                {/* </Grid> */}
                <Grid md={1}>
                <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                fontSize: 14,
                textAlign: "center"
              }}
            >
              {"Registered In: "+ this.state.courseMenuItems.length}
            </Typography>

                </Grid>
                <Grid item xs={6} md={3}>
                <Autocomplete
                  style={{marginTop: 20}}
                  multiple
                  fullWidth
                  // disabled={!data.examEntryStatusId}
                  options={this.state.courseMenuItems}
                  value={this.state.courseCreditId}
                  onChange={(event, value) =>
                    this.handleSetcourseCreditId(value)
                  }
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.Label}
                  getOptionSelected={(option) => this.courseSelected(option)}
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
                        checked={selected}
                        color="primary"
                      />
                      {option.Label}
                    </Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Selected Courses"
                      placeholder="Search and Select"
                      error={!!this.state.courseCreditIdError}
                      helperText={this.state.courseCreditIdError}
                    />
                  )}
                />
                <TextField
                type="hidden"
                 id="courseIds"
                  name="courseIds"
                   value={this.state.courseCreditIds}
                   />
                </Grid>
                <Grid item md={3}>
                   <TextField
                    id="UOLNo"
                    name="UOLNo"
                    variant="outlined"
                    label="UOL#"
                    defaultValue={data.uolNumber || ""}
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <br />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <DialogActions>
            <Button 
              autoFocus 
              onClick={this.handleClose} 
              color="secondary"
            >
              Close
            </Button>
            <Button
              onClick={onFormSubmit()}
              color="primary"
              disabled={isLoading}
              autoFocus
            >
              {isLoading ? <CircularProgress style={{color:'#174A84'}} size={24}/> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}
export default withStyles(styles)(F212FormChangeStatusPopup);
