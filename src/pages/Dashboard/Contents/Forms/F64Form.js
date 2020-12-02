import React, { Component, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import {Typography, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Divider, CircularProgress, Grid, Button, Checkbox,
  FormGroup, FormControlLabel, FormControl} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DatePicker } from "@material-ui/pickers";
import { format } from "date-fns";
import BottomBar from "../../../../components/BottomBar/BottomBar";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(29, 95, 152)", //theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: '1px solid white'
  },
  body: {
    fontSize: 14,
    border: '1px solid rgb(29, 95, 152)'
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
      "&:hover":{
        backgroundColor:"#bdbdbd"
      }
    },
    '&:nth-of-type(even)': {
      "&:hover":{
        backgroundColor:"#bdbdbd"
      }
    },
  },
}))(TableRow);

const styles = ({
  table: {
    minWidth: 750,
  },
});

class R46Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadPdf: false,
      applicationStatusId: 1,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      sectionsMenuItems: [],
      sectionId: "",
      sectionIdError:"",
      startTimeId:"",
      startTimeIdError:"",
      startTimeMenuItems:[],
      preDate: this.getTodaysDate(),
      preDateError: "",
      tableData: [],
      isAttendanceEditable: false,
      isTeacherOnly: false
    };
  }

  getTodaysDate = () => {
    let todaysDate = new Date();
    //tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    return todaysDate;
  }

  getDateInString = (todayDate) => {
    let today = todayDate;
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) { dd = "0" + dd; }
    if (mm < 10) { mm = "0" + mm; }
    today = dd + "-" + mm + "-" + yyyy;
    return today;
  };

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {  return; }
    this.setState({ isOpenSnackbar: false });
  };

  getCourses = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C64CommonAcademicsSectionCoursesView`;
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
    data.append("courseId", courseId);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C64CommonAcademicsSectionsView`;
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

  getTimeSlots = async (sectionId, classDate) => {
    let data = new FormData();
    data.append("sectionId", sectionId);
    data.append("classDate", `${format(classDate, "dd-MM-yyyy")}`);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C64CommonAcademicsSectionsStartTimeView`;
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
            this.setState({startTimeMenuItems: json.DATA || []});
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

  getData = async (sectionId,classDate,startTimeId) => {
    let data = new FormData();
    data.append("sectionId", sectionId);
    //data.append("classDate", classDate);
    data.append("classDate",`${format(classDate, "dd-MM-yyyy")}`);
    data.append("startTime", startTimeId);
    this.setState({
      isLoading: true,
      isTeacherOnly: false
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C64CommonStudentsView`;
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
            this.setState({
              tableData: [],
              isAttendanceEditable:false
            });
            let data = json.DATA || [];
            this.setState({tableData: data[0].studentNamesList || []});
            //let studentNamesList = data[0].studentNamesList || [];
            //let studentNamesListLength = studentNamesList.length;
            // for(let i=0; i<studentNamesListLength; i++){
            //   if(studentNamesList[i].isPresent){
            //     this.setState({isAttendanceEditable:true});
            //     break;
            //   }
            // }
            if(data[0].isEditAble){
              if(data[0].isEditAble==0){
                this.setState({isAttendanceEditable:true});
              }
            }
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getData", json);
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

  handleSetCourse = (value) => {    
    this.setState({
      sectionId:"",
      sectionsMenuItems:[],
      preDate: this.getTodaysDate(),
      startTimeId:"",
      startTimeMenuItems:[],
      tableData:[],
      courseId: value, 
      courseIdError: "",
      isTeacherOnly: false
    });
    if(value) {
      this.getSections(value.id);
    }
  };

  handleSetSection = (value) => {    
    this.setState({
      preDate: this.getTodaysDate(),
      startTimeId:"",
      startTimeMenuItems:[],
      tableData:[],
      sectionId: value, 
      sectionError: "",
      isTeacherOnly: false
    });
    if(value) {
      this.getTimeSlots(value.id, this.state.preDate);
    }
  };

  handleChangePreDate = (date) => {
    this.setState({
      preDate: date,
      startTimeId:"",
      isTeacherOnly: false,
      tableData: []
    });
    this.getTimeSlots(this.state.sectionId.id, date);
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
        case "startTime":
          this.setState({tableData:[]});
        break;
    default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    this.setState({[name]: checked});
    if(checked){
      this.setState({tableData:[]});
    }
  }

  isCourseValid = () => {
    let isValid = true;        
    if (!this.state.courseId) {
        this.setState({courseIdError:"Please select course."});
        document.getElementById("courseId").focus();
        isValid = false;
    } else {
        this.setState({courseIdError:""});
    }
    return isValid;
  }

  onFormSubmit = async (e) => {
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C64CommonAcademicsAttendanceSave`;
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
            this.setState({
              tableData: [],
              preDate: this.getTodaysDate(),
              sectionId:"",
              courseId:"",
              preDate: this.getTodaysDate(),
              startTimeMenuItems: [],
              startTimeId: "",
              isTeacherOnly: false
            });
            setTimeout(() => {
                //window.location.reload();
            }, 2000);
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}+<br/>+{json.USER_MESSAGE}</span>,"error");
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getCourses();
  }

  render() {

    const { classes } = this.props;

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <div
          style={{
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              Manual Attendance Sheet
            </Typography>
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <br/>
          <Grid 
            container 
            justify="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={4} md={3}>
              <Autocomplete
                fullWidth
                id="courseId"
                options={this.state.coursesMenuItems}
                value={this.state.courseId}
                onChange={(event, value) => this.handleSetCourse(value)}
                getOptionLabel={(option) => typeof option.label === 'string' ? option.label : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Courses"
                    placeholder="Search and Select"
                    required
                    error={!!this.state.courseIdError}
                    helperText={this.state.courseIdError ? this.state.courseIdError : "" }
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} md={3}>
              <Autocomplete
                fullWidth
                id="sectionId"
                disabled={!this.state.courseId}
                options={this.state.sectionsMenuItems}
                value={this.state.sectionId}
                onChange={(event, value) => this.handleSetSection(value)}
                getOptionLabel={(option) => typeof option.label === 'string' ? option.label : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Sections"
                    placeholder="Search and Select"
                    required
                    error={!!this.state.sectionIdError}
                    helperText={this.state.sectionIdError ? this.state.sectionIdError : "" }
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <DatePicker
                autoOk
                name="effectiveDate"
                id="effectiveDate"
                label="Date"
                invalidDateMessage=""
                disableFuture
                minDate="2020-01-01"
                placeholder=""
                variant="inline"
                inputVariant="outlined"
                format="dd-MM-yyyy"
                fullWidth
                required
                value={this.state.preDate}
                onChange={this.handleChangePreDate}
                error={!!this.state.preDateError}
                helperText={this.state.preDateError}
                disabled={!this.state.sectionId}
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <TextField
                id="startTime"
                name="startTimeId"
                variant="outlined"
                label="Time"
                onChange={this.onHandleChange}
                value={this.state.startTimeId}
                error={!!this.state.startTimeIdError}
                helperText={this.state.startTimeIdError}
                disabled={!this.state.sectionId}
                required
                fullWidth
                select
              >
                {this.state.startTimeMenuItems && !this.state.isLoading ? (
                  this.state.startTimeMenuItems.map((dt, i) => (
                    <MenuItem key={"startTimesMenuItems"+dt.id} value={dt.id}>
                      {dt.startTime}
                    </MenuItem>
                  ))
                ) : (
                  <Grid container justify="center">
                    <CircularProgress disableShrink />
                  </Grid>
                )}
              </TextField>
            </Grid>
            <Grid item xs={2} md={1}>
              <Button 
                variant="contained" 
                color="primary"
                disabled={!this.state.startTimeId}
                onClick={()=>this.getData(this.state.sectionId.id ,this.state.preDate, this.state.startTimeId)}
                style={{
                  paddingTop:14,
                  paddingBottom:14
                }}
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={12}>
            <Divider
              style={{
                backgroundColor: "rgb(58, 127, 187)",
                opacity: "0.3",
              }}
            />
            </Grid>
            <Grid item xs={12}>
              <form id="myForm">
              <TextField type="hidden" name="sectionId" value={this.state.sectionId?this.state.sectionId.id:""}/>
              <TextField type="hidden" name="classDate" value={this.getDateInString(this.state.preDate)}/>
              <TextField type="hidden" name="startTime" value={this.state.startTimeId}/>
              <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      name="isTeacherOnly"
                      value="1"
                      control={<Checkbox color="primary" checked={this.state.isTeacherOnly} onChange={this.handleChangeCheckbox} name="isTeacherOnly" />}
                      label="Teacher Only"
                      labelPlacement="end"
                      disabled={!this.state.startTimeId}
                    />
                  </FormGroup>
                </FormControl>
                <TableContainer component={Paper} style={{overflowX:"inherit"}}>
                  <Table size="small" className={classes.table} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(47, 87, 165)', width:"75%"}}>Name</StyledTableCell>
                          {/* <StyledTableCell align="center">Dates</StyledTableCell> */}
                          <StyledTableCell align="center" style={{borderRight: '1px solid rgb(47, 87, 165)', width:"25%" }}>Mark&nbsp;Attendance</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.tableData.length > 0 ?
                          this.state.tableData.map((dt,i)=>
                            <StyledTableRow key={dt+i}>
                              <StyledTableCell component="th" scope="row"><Typography component="span" variant="body1" color="primary">{dt.label}</Typography></StyledTableCell>
                              {/* <StyledTableCell  align="center">&nbsp;</StyledTableCell> */}
                              <StyledTableCell align="center">
                              <Checkbox
                                defaultChecked={!!dt.isPresent}
                                color="primary"
                                name="studentId"
                                value={dt.id}
                                inputProps={{ 'aria-label': 'studentId'}}
                              />
                              </StyledTableCell>
                            </StyledTableRow>
                          )
                          : this.state.isLoading ?
                            <StyledTableRow key={1}>
                              <StyledTableCell component="th" scope="row" colSpan={2}><center><CircularProgress /></center></StyledTableCell>
                            </StyledTableRow>
                            :
                            <StyledTableRow key={1}>
                              <StyledTableCell component="th" scope="row" colSpan={2}><center><b>No Data</b></center></StyledTableCell>
                            </StyledTableRow>
                          }
                    </TableBody>
                  </Table>
                </TableContainer>
              </form>
            </Grid>
          </Grid>
          <br/>
          <br/>
          <BottomBar
            left_button_text="View"
            left_button_hide={true}
            bottomLeftButtonAction={this.viewReport}
            right_button_text="Save"
            bottomRightButtonAction={this.onFormSubmit}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            disableRightButton={!this.state.tableData.length && !this.state.isTeacherOnly}
            hideRightButton={this.state.isAttendanceEditable}
          />
          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleCloseSnackbar()}
          />
        </div>
      </Fragment>
    );
  }
}
export default withStyles(styles)(R46Reports);
