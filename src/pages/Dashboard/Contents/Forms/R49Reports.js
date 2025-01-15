import React, { Component, Fragment } from "react";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, Button} from "@material-ui/core";
import {Typography, TextField, MenuItem} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import R49ReportsTableComponent from "./R49ReportsTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";

class R49Reports extends Component {
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
      assignmentsData: [],
      teachersMenuItems: [],
      teacherId: "",
      teacherIdError: "",
      assignmentsMenuItems: [],
      sectionId: "",
      sectionIdError: "",
      sectionsMenuItems: [],
      assignmentId:"",
      assignmentIdError:"",
      sectionId:"",
      academicSessionMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
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
    if (reason === "clickaway") {  return; }
    this.setState({ isOpenSnackbar: false });
  };

  getTeachers = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C49CommonTeachersView`;
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
            this.setState({teachersMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getTeachers", json);
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

  loadAcademicSessions = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonAcademicSessionsViewV2`;
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
            let array = json.DATA || [];
            let arrayLength = array.length;
            let res = array.find( (obj) => obj.isActive === 1 );
            if(res){
              this.setState({academicSessionId:res.ID});
             // this.getCourses(res.ID);
            }
            this.setState({ academicSessionMenuItems: array });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadAcademicSessions", json);
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

  getData = async (teacherId,sessionId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("teacherId", teacherId);
    data.append("sessionId", sessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C49CommonTeacherSectionsVew`;
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
            this.setState({assignmentsData: json.DATA || []});
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

  handleSetTeacher = (value) => {
    if(value) { 
        this.getData(value.id,this.state.academicSessionId); 
    }
    else { 
      this.setState({assignmentsData:[]}); 
    }
    this.setState({
      teacherId: value, 
      teacherIdError: ""
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
        case "teacherId":
            this.getData(value);
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
    if (!this.state.teacherId) {
        this.setState({teacherIdError:"Please select course."});
        document.getElementById("teacherId").focus();
        isValid = false;
    } else {
        this.setState({teacherIdError:""});
    }
    return isValid;
  }
  
  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  handleToggleSearchBar = () => {
    this.setState({ showSearchBar: !this.state.showSearchBar });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadAcademicSessions();
    this.getTeachers();
  }

  render() {

    const columns = [
      { name: "SRNo", title: "SR#" },
      { name: "courseLabel", title: "Course" },
      { name: "sectionLabel", title: "Section" },
    ];

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
              {/* 
              <Tooltip title="Back">
                <IconButton onClick={() => window.history.back()}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip> 
              */}
              Teacher Sections Report
            </Typography>
            <div style={{ float: "right" }}>
              {/* 
              <Tooltip title="Search Bar">
                  <IconButton
                      onClick={this.handleToggleSearchBar}
                  >
                      <FilterIcon fontSize="default" color="primary"/>
                  </IconButton>
              </Tooltip> 
              */}
              <Tooltip title="Table Filter">
                <IconButton
                  style={{ marginLeft: "-10px" }}
                  onClick={this.handleToggleTableFilter}
                >
                  <FilterIcon fontSize="default" color="primary" />
                </IconButton>
              </Tooltip> 
            </div>
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
            justifyContent="center"
            alignItems="center"
            spacing={2}
          > 
            <Grid item xs={12} md={4}>
                <TextField
                id="academicSessionId"
                name="academicSessionId"
                variant="outlined"
                label="Academic Session"
                fullWidth
                select
                onChange={this.onHandleChange}
                value={this.state.academicSessionId}
                error={!!this.state.academicSessionIdError}
                helperText={this.state.academicSessionIdError ? this.state.academicSessionIdError : " "}
                // disabled={!this.state.schoolId}
              >
                {this.state.academicSessionMenuItems && !this.state.isLoading ? 
                  this.state.academicSessionMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"academicSessionMenuItems"+dt.ID}
                      value={dt.ID}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))
                :
                  <Grid 
                    container 
                    justifyContent="center"
                  >
                    <CircularProgress />
                  </Grid>
                }
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                  fullWidth
                  id="teacherId"
                  options={this.state.teachersMenuItems}
                  value={this.state.teacherId}
                  onChange={(event, value) => this.handleSetTeacher(value)}
                  getOptionLabel={(option) => typeof option.label === 'string' ? option.label : ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Teachers"
                      placeholder="Search and Select"
                      error={!!this.state.teacherIdError}
                      helperText={this.state.teacherIdError ? this.state.teacherIdError : "" }
                    />
                  )}
                />
                <br/>
              {/* 
              <TextField
                id="teacherId"
                name="teacherId"
                variant="outlined"
                label="Teacher"
                onChange={this.onHandleChange}
                value={this.state.teacherId}
                error={!!this.state.teacherIdError}
                helperText={this.state.teacherIdError ? this.state.teacherIdError : " "}
                required
                fullWidth
                select
              >
                {this.state.teachersMenuItems && !this.state.isLoading ? 
                  this.state.teachersMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"teachersMenuItems"+dt.id}
                      value={dt.id}
                    >
                      {dt.label}
                    </MenuItem>
                  ))
                :
                  <Grid 
                    container 
                    justifyContent="center">
                      <CircularProgress />
                    </Grid>
                }
              </TextField> 
              */}
            </Grid>
          </Grid>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          {this.state.assignmentsData && !this.state.isLoading ? (
            <R49ReportsTableComponent
              data={this.state.assignmentsData}
              columns={columns}
              showFilter={this.state.showTableFilter}
            />
          ) : (
            <Grid 
              container 
              justifyContent="center" 
              alignItems="center"
            >
              <Grid item xs={1}>
                <br/>
                <CircularProgress />
              </Grid>
            </Grid>
          )}
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
export default R49Reports;
