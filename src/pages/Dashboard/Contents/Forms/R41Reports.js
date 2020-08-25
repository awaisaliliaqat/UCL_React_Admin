import React, { Component, Fragment } from "react";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, Button} from "@material-ui/core";
import {Typography, TextField, MenuItem} from "@material-ui/core";
import ExcelIcon from "../../../../assets/Images/excel.png";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import R41ReportsTableComponent from "./R41ReportsTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchIcon from "mdi-material-ui/FileSearchOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

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

class R41Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadExcel: false,
      applicationStatusId: 1,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      assignmentsData: [],
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      assignmentsMenuItems: [],
      sectionId: "",
      sectionIdError: "",
      sectionsMenuItems: [],
      assignmentId:"",
      assignmentIdError:"",
      sectionId:""
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

  getCourses = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C41CommonAcademicsAssignmentsCoursesView`;
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

  getSections = async (courseId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("courseId", courseId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C41CommonAcademicsSectionsTeachersView`;
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

  getAssignments = async (sectionId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("sectionId", sectionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C41CommonAcademicsAssignmentsView`;
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
            this.setState({assignmentsMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getAssignments", json);
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

  getData = async (sectionId, assignmentId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("sectionId", sectionId);
    data.append("assignmentId", assignmentId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C41CommonAcademicsAssignmentsSummaryView`;
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

  getSectionIdFromCourseId = (courseId) => {
    let coursesMenuItems = this.state.coursesMenuItems;
    let res = coursesMenuItems.find((dt) => dt.id === courseId);
    if(res){
      this.setState({sectionId:res.sectionId});
      return res.sectionId;
    }
    return 0;
  }

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
        case "courseId":
            this.setState({
              sectionId: "",
              assignmentId: "",
              assignmentsData: []
            });
            this.getSections(value);
            //this.getAssignments(this.getSectionIdFromCourseId(value));
          break;
        case "sectionId":
            this.setState({
              assignmentId: "",
              assignmentsData: []
            });
            this.getAssignments(value);
          break;
          case "assignmentId":
            this.setState({
              assignmentsData: []
            });
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
    if (!this.state.courseId) {
        this.setState({courseIdError:"Please select course."});
        document.getElementById("courseId").focus();
        isValid = false;
    } else {
        this.setState({courseIdError:""});
    }
    return isValid;
  }

  isSectionValid = () => {
    let isValid = true;        
    if (!this.state.sectionId) {
        this.setState({sectionIdError:"Please select section."});
        document.getElementById("sectionId").focus();
        isValid = false;
    } else {
        this.setState({sectionIdError:""});
    }
    return isValid;
  }

  isAssignmentValid = () => {
    let isValid = true;        
    if (!this.state.assignmentId) {
        this.setState({assignmentIdError:"Please select assignment."});
        document.getElementById("assignmentId").focus();
        isValid = false;
    } else {
        this.setState({assignmentIdError:""});
    }
    return isValid;
}

  handleGetData = () => {
    if(
      !this.isCourseValid() ||
      !this.isSectionValid() ||
      !this.isAssignmentValid()
    )
    {return;}
    this.getData(this.state.sectionId, this.state.assignmentId);
  }
  
  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  handleToggleSearchBar = () => {
    this.setState({ showSearchBar: !this.state.showSearchBar });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getCourses();
  }

  render() {

    const columns = [
      { name: "SRNo", title: "SR#" },
      { name: "nucleusId", title: "NucleusID" },
      { name: "studentName", title: "Student\xa0Name" },
      { name: "assignmentSubmitted", title: "Submitted On" },
      { name: "obtainedMarks", title: "Obtained Marks" },
      { name: "totalMarks", title: "Total\xa0Marks" },
      { name: "remarks", title: "Remarks" }
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
              <Tooltip title="Back">
                <IconButton onClick={() => window.history.back()}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              Teacher Assigmnent Summary Report
            </Typography>
            {/* 
              <img alt="" src={ExcelIcon} onClick={() => this.downloadExcelData()} style={{
                  height: 30, width: 32,
                  cursor: `${this.state.isDownloadExcel ? 'wait' : 'pointer'}`,
               }}
              /> 
            */}
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
            justify="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12} md={4}>
              <TextField
                id="courseId"
                name="courseId"
                variant="outlined"
                label="Course"
                onChange={this.onHandleChange}
                value={this.state.courseId}
                error={!!this.state.courseIdError}
                helperText={this.state.courseIdError ? this.state.courseIdError : " "}
                required
                fullWidth
                select
              >
                {this.state.coursesMenuItems && !this.state.isLoading ? 
                  this.state.coursesMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"coursesMenuItems"+dt.id}
                      value={dt.id}
                    >
                      {dt.label}
                    </MenuItem>
                  ))
                :
                  <Grid 
                    container 
                    justify="center">
                      <CircularProgress />
                    </Grid>
                }
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                id="sectionId"
                name="sectionId"
                variant="outlined"
                label="Section"
                required
                fullWidth
                select
                onChange={this.onHandleChange}
                value={this.state.sectionId}
                error={!!this.state.sectionIdError}
                helperText={this.state.sectionIdError ? this.state.sectionIdError : " "}
                disabled={!this.state.courseId}
              >
                {this.state.sectionsMenuItems && !this.state.isLoading ? 
                  this.state.sectionsMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"sectionsMenuItems"+dt.id}
                      value={dt.id}
                    >
                      {dt.label}
                    </MenuItem>
                  ))
                :
                  <Grid 
                    container 
                    justify="center">
                      <CircularProgress />
                    </Grid>
                }
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                id="assignmentId"
                name="assignmentId"
                variant="outlined"
                label="Assignment"
                required
                fullWidth
                select
                onChange={this.onHandleChange}
                value={this.state.assignmentId}
                error={!!this.state.assignmentIdError}
                helperText={this.state.assignmentIdError ? this.state.assignmentIdError : " "}
                disabled={!this.state.sectionId}
              >
                {this.state.assignmentsMenuItems && !this.state.isLoading ? 
                  this.state.assignmentsMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"assignmentsMenuItems"+dt.id}
                      value={dt.id}
                    >
                      {dt.label}
                    </MenuItem>
                  ))
                :
                  <Grid container justify="center"><CircularProgress /></Grid>
                }
              </TextField>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="contained"
                color="primary"
                disabled={this.state.isLoading}
                onClick={() => this.handleGetData()}
                style={{width:"100%", height:54, marginTop:-25}}
              > 
                {this.state.isLoading ? 
                    <CircularProgress style={{color:'white'}} size={36}/>
                    : 
                    "Search"
                }
              </Button>
            </Grid>
          </Grid>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          {this.state.assignmentsData && !this.state.isLoading ? (
            <R41ReportsTableComponent
              data={this.state.assignmentsData}
              columns={columns}
              showFilter={this.state.showTableFilter}
            />
          ) : (
            <Grid 
              container 
              justify="center" 
              alignItems="center"
            >
              <CircularProgress />
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
export default R41Reports;
