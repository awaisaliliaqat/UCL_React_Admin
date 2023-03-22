import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,Button,
  Paper,
  Divider,
  CircularProgress,
  Grid, Fab,IconButton, Tooltip
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DatePicker } from "@material-ui/pickers";
import { format } from 'date-fns';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(29, 95, 152)", //theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: "1px solid white",
  },
  body: {
    fontSize: 14,
    border: "1px solid rgb(29, 95, 152)",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const styles = {
  table: {
    minWidth: 750,
  },
};

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

class F229Form extends Component {
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
      roomsMenuItems: [],
      academicSessionIdMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      programGroupsMenuItems: [],
      programGroupId: "",
      programGroupIdError: "",
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      sectionsMenuItems: [],
      sectionId: "",
      sectionIdError: "",
      changeTypeId: "1",
      roomsObject: {},
      roomsObjectError: "",
      roomsId: "",
      roomsData:[],
      preDaysMenuItems: [], //["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      preTimeStartMenuItems: [],
      startTime:"",
      startTimeError:"",
      scheduleDate: null,
      scheduleDateError: "",
      duration:"",
      TimeTableData:[]
    };
  }

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ isOpenSnackbar: false });
  };

  handleDateChange = (date, name) => {
   
    const errName = `${name}Error`;
    this.setState({
        [name]: date,
        [errName]: "",
        TimeTableData:[],
    });
    this.getData(this.state.sectionId,date)
    
}



  resetValues(){
    this.setState({
      roomsId:"",
      startTime: "",
      duration:"",
      roomsObject:{}

    });

  }
  getRoomsData = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C229CommonAcademicsScheduleClassRoomsView`;
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
            this.setState({ roomsData: json.DATA || [] });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };
 
  onFormSubmit = async (e) => {
   
    if(this.isValid()){
      this.setState({
          isLoading: true
      })
      let myForm = document.getElementById("myForm");
      const data = new FormData(myForm);
      data.append("id",0);
    
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C229CommonAcademicsExtraClassSave`;
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
                      this.getData(this.state.sectionId,this.state.scheduleDate);

                      this.resetValues();

                    
                  } else {

                      if(json.SYSTEM_MESSAGE=="java.lang.Exception: Class Already Exists."){
                        this.handleOpenSnackbar(
                          "Class Already Exists.",
                          "error"
                        );
                      }else{
                          this.handleOpenSnackbar(
                            json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
                            "error"
                        );
                      }
                     
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
                      this.handleOpenSnackbar(
                          "Failed to Save ! Please try Again later.",
                          "error"
                      );
                  }
              }
          );
      this.setState({ isLoading: false });
  }
}

loadProgrammeGroups = async (academicsSessionId) => {
  let data = new FormData();
  data.append("academicsSessionId", academicsSessionId);
  this.setState({ isLoading: true });
  const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C31CommonAcademicsSessionsOfferedProgrammesView`;
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
          this.setState({ programmeGroupIdMenuItems: json.DATA });
        } else {
          this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
        }
        console.log("loadProgrammeGroups", json);
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

 

  getCourses = async (programmeGroupId) => {
    let data = new FormData();
    data.append("programmeGroupId", programmeGroupId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C229CommonSessionOfferedProgrammeCoursesView`;
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
            this.setState({ coursesMenuItems: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("getCourses", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getSections = async (courseId) => {
    let data = new FormData();
    data.append("courseId", courseId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C229CommonAcademicsSections`;
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
            this.setState({ sectionsMenuItems: json.DATA || [] });
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getData = async (sectionId,scheduleDate) => {
   
    let subUrl = "/common/C229CommonAcademicsExtraClassView";
    
    this.setState({ isLoading: true });
    let data = new FormData();
    let scheduleData=format(scheduleDate, "dd-MM-yyyy");
    data.append("id",0);
    data.append("sectionId", sectionId);
    data.append("scheduleDate",scheduleData);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}${subUrl}`;
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
            this.setState({ TimeTableData: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({ isLoading: false });
  };


  isValid(){
   
    if(!this.state.startTime){
     
      return false
    }

   
    if(!this.state.duration){
      
      return false;
    }
   
    if(!this.state.roomsId){
      
      return false;
    }
   
    return true;
    
  }


  onAutoCompleteChange = (e, value) => {
   
    let object = isEmpty(value) ? {} : value;
   
    this.setState({
      roomsObject: object,
      roomsId: object.ID || "",
      roomsObjectError: ""
    })
  }

 


  handleSetCourses = (value) => {
    this.setState({
      sectionId: "",
      sectionsMenuItems: [],
      roomsTableData: [],
      //changeTypeId: "",
    });
    if (value) {
      this.getSections(value.id);
    }
    this.setState({
      courseId: value,
      courseIdError: "",
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "academicsSessionId":
        this.setState({
          programGroupId:"",
          coursesMenuItems: [],
          courseId: null,
          sectionsMenuItems: [],
          sectionId: "",
          //changeTypeId: "",
          roomsTableData: [],
        });
        this.getCourses(value);
        break;
      case "programGroupId":
        this.setState({
          coursesMenuItems: [],
          courseId: null,
          sectionsMenuItems: [],
          sectionId: "",
          //changeTypeId: "",
          roomsTableData: [],
        });
        this.getCourses(value);
        break;
      case "sectionId":
        this.setState({
          roomsTableData: [],
          //changeTypeId: "",
        });
        
       this.getData(value, this.state.scheduleDate);
        break;
      case "scheduleDate":
        this.setState({
          roomsTableData: [],
        });
        this.getData(this.state.sectionId, value);
        break;

        
      default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isCourseValid = () => {
    let isValid = true;
    if (!this.state.programGroupId) {
      this.setState({ programGroupIdError: "Please select course." });
      document.getElementById("programGroupId").focus();
      isValid = false;
    } else {
      this.setState({ programGroupIdError: "" });
    }
    return isValid;
  };


  loadAcademicSession = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C229CommonAcademicSessionsView`;
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
            this.setState({ academicSessionIdMenuItems: json.DATA });
            for (let i=0; i<this.state.academicSessionIdMenuItems.length; i++) {
              if (this.state.academicSessionIdMenuItems[i].isActive == "1") {
                this.state.academicSessionId = this.state.academicSessionIdMenuItems[i].ID;
                this.loadProgrammeGroups(this.state.academicSessionId);
              }
            }
          } else {

            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");

          }
          console.log("loadAcademicSession", json);
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

  getPreTimeSlotsMenuItems = () => {
    var x = 15; //minutes interval
    var times = []; // time array
    var tt = 480; // start time 0 For 12 AM
    var ap = ["AM", "PM"]; // AM-PM

    //loop to increment the time and push results in array
    for (var i = 0; tt < 24 * 60; i++) {
      var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
      var mm = tt % 60; // getting minutes of the hour in 0-55 format
      times[i] =
        ("0" + ((hh % 12) !== 0 ? (hh % 12) : 12)).slice(-2) +
        ":" +
        ("0" + mm).slice(-2) +
        " " +
        ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
      tt = tt + x;
      if (times[i] == "10:00 PM") {
        break;
      }
    }
    console.log(times);
    this.setState({ preTimeStartMenuItems: times });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    
 
    this.setState({
     
      scheduleDate: new Date()
     
  })
    //this.loadDaysOfWeek();
    this.loadAcademicSession();
    this.getPreTimeSlotsMenuItems();
    this.getRoomsData();
    
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
              Add Extra Class
            </Typography>
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <br />
          <form id="myForm">
          <Grid container justify="left" alignItems="center" spacing={2}>
             <Grid item xs={12} md={2}>
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
                      key={"academicSessionIdMenuItems" + dt.ID}
                      value={dt.ID}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                id="programGroupId"
                name="programGroupId"
                variant="outlined"
                label="Program Group"
                onChange={this.onHandleChange}
                value={this.state.programGroupId}
                error={!!this.state.programGroupIdError}
                helperText={this.state.programGroupIdError}
                required
                fullWidth
                select
              >
                {this.state.programmeGroupIdMenuItems && !this.state.isLoading ? (
                  this.state.programmeGroupIdMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"programGroupsMenuItems" + dt.Id}
                      value={dt.Id}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))
                ) : (
                  <Grid container justify="center">
                    <CircularProgress />
                  </Grid>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                fullWidth
                id="courseId"
                options={this.state.coursesMenuItems}
                value={this.state.courseId}
                onChange={(event, value) => this.handleSetCourses(value)}
                getOptionLabel={(option) =>
                  typeof option.label === "string" ? option.label : ""
                }
                disabled={!this.state.programGroupId}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    required
                    label="Courses"
                    placeholder="Search and Select"
                    error={!!this.state.courseIdError}
                    helperText={this.state.courseIdError}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                id="sectionId"
                name="sectionId"
                variant="outlined"
                label="Sections"
                onChange={this.onHandleChange}
                value={this.state.sectionId}
                error={!!this.state.sectionIdError}
                helperText={this.state.sectionIdError}
                required
                fullWidth
                select
                disabled={!this.state.courseId}
              >
                {this.state.sectionsMenuItems && !this.state.isLoading ? (
                  this.state.sectionsMenuItems.map((dt, i) => (
                    <MenuItem key={"sectionsMenuItems" + dt.id} value={dt.id}>
                      {dt.label}
                    </MenuItem>
                  ))
                ) : (
                  <Grid container justify="center">
                    <CircularProgress />
                  </Grid>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
                <DatePicker
                    autoOk
                    invalidDateMessage=""
                    variant="inline"
                    inputVariant="outlined"
                    format="dd-MM-yyyy"
                    fullWidth
                    name="scheduleDate"
                    disabled={!this.state.sectionId}
                    //minDate={new Date().setDate(new Date().getDate() + 1)}
                    // minDate={this.state.scheduleDate}
                    value={this.state.scheduleDate}
                    error={this.state.scheduleDateError}
                    onChange={(date) => this.handleDateChange(date, "scheduleDate")}
                    label="Date"
                    style={{
                        marginRight: 5
                    }}
                />
            </Grid>
          </Grid>

          <Grid  style={{marginTop:"40px"}} container justify="left" alignItems="center" spacing={2}>
            <Grid item xs={12}>
              <Divider
                style={{
                  backgroundColor: "rgb(58, 127, 187)",
                  opacity: "0.3",
                }}
              />
            </Grid>

               <input type="hidden" name="classRoomId" value={this.state.roomsId}/>
               <input type="hidden" name="courseId" value={!this.state.courseId?0:this.state.courseId.id}/>
                 
                  <Grid item xs={12} md={2}>
                    <TextField
                      id="startTime"
                      name="startTime"
                      variant="outlined"
                      label="Time Slot"
                      size="small"
                      onChange={this.onHandleChange}
                      value={this.state.startTime}
                      error={!!this.state.preTimeStartError}
                      helperText={
                        this.state.preTimeStartError
                      }
                      required
                      fullWidth
                      select
                    >
                      {this.state.preTimeStartMenuItems ? (
                        this.state.preTimeStartMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"preTimeStartMenuItems" + dt + i}
                            value={dt}
                          >
                            {dt}
                          </MenuItem>
                        ))
                      ) : (
                          <MenuItem>
                            <CircularProgress />
                          </MenuItem>
                        )}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                     size="small"
                      id="preTimeDuration"
                      name="duration"
                      label={"Duration (Minutes)"}
                      type="number"
                      required
                      fullWidth
                      variant="outlined"
                      onChange={this.onHandleChange}
                      value={this.state.duration}
                      error={!!this.state.preTimeDurationError}
                      helperText={this.state.preTimeDurationError}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Autocomplete
                     size="small"
                      id="classRoomId"
                      getOptionLabel={(option) => typeof option.Label === "string" ? option.Label : ""}
                      fullWidth
                      value={this.state.roomsObject}
                      onChange={this.onAutoCompleteChange}
                      options={this.state.roomsData}
                      renderInput={(params) => <TextField error={!!this.state.roomsObjectError} variant="outlined" placeholder="Rooms" {...params} />}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                     size="small"
                      id="capacity"
                      label={"Student Capacity"}
                     value={isEmpty(this.state.roomsObject) ? "" : this.state.roomsObject.studentCapacity}
                      variant="outlined"
                      fullWidth
                     // placeholder="Student Capacity"
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={2} style={{ textAlign: "center" }}>
                     <Button disabled={this.state.isLoading || !this.state.sectionId} variant="contained"
                        onClick={() => this.onFormSubmit()}
                        style={{
                            //width: 90
                        }} color="primary">
                        {this.state.isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Send For Approval"}
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
                  <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                  <StyledTableCell
                      align="center"
                      style={{ borderLeft: "1px solid rgb(29, 95, 152)" }}
                    >
                     Course
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ borderLeft: "1px solid rgb(29, 95, 152)" }}
                    >
                     Section
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{ borderLeft: "1px solid rgb(29, 95, 152)" }}
                    >
                      Date
                    </StyledTableCell>
                  
                   
                    <StyledTableCell
                      align="center"
                      style={{ borderLeft: "1px solid rgb(29, 95, 152)" }}
                    >
                      Start Time
                    </StyledTableCell>

                    <StyledTableCell
                      align="center"
                      style={{ borderLeft: "1px solid rgb(29, 95, 152)" }}
                    >
                     Duration
                    </StyledTableCell>
                  
                    <StyledTableCell
                      align="center"
                      style={{ borderLeft: "1px solid rgb(29, 95, 152)" }}
                    >
                     Room
                    </StyledTableCell>

                    <StyledTableCell
                      align="center"
                      style={{ borderRight: "1px solid rgb(29, 95, 152)" }}
                    >
                     Status
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.TimeTableData.length > 0 ? (
                    this.state.TimeTableData.map((row, index) => (
                      <StyledTableRow key={row.id + index}>
                         <StyledTableCell align="center">
                         {row.courseLabel}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                         {row.sectionLabel}
                        </StyledTableCell>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {row.classDate}
                        </StyledTableCell>
                       
                        <StyledTableCell align="center">
                          {row.classTime}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                         {row.classDuration}
                        </StyledTableCell>

                       
                        <StyledTableCell align="center">
                         {row.classRoomLabel}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                         {row.approvalStatus}
                        </StyledTableCell>
                        
                      </StyledTableRow>
                    ))
                  ) : this.state.isLoading ? (
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={8}>
                        <center>
                          <CircularProgress />
                        </center>
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={8}>
                        <center>
                          <b>No Data</b>
                        </center>
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>    
           
          </Grid>
          </form>
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
export default withStyles(styles)(F229Form);
