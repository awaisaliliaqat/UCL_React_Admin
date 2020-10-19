import React, { Component, Fragment } from "react";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, Button} from "@material-ui/core";
import {Typography, TextField, MenuItem} from "@material-ui/core";
import ExcelIcon from "../../../../assets/Images/excel.png";
import PDFIcon from "../../../../assets/Images/pdf_export_icon.png";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import R206ReportsTableComponent from "./R206ReportsTableComponent";
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

class R206Reports extends Component {
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
      examsData: [],
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      examsMenuItems: [],
      sectionId: "",
      sectionIdError: "",
      sectionsMenuItems: [],
      examId:"",
      examIdError:"",
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C206CommonAcademicsExamsCoursesView`;
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C206CommonAcademicsSectionsTeachersView`;
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

  getExams = async (sectionId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("sectionId", sectionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C206CommonAcademicsExamsView`;
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
            this.setState({examsMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getExams", json);
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

  getData = async (sectionId, examId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("sectionId", sectionId);
    data.append("examId", examId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C206CommonAcademicsExamsSummaryView`;
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
            this.setState({examsData: json.DATA || []});
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

  downloadPDFData = async () => {

    if(
      !this.isCourseValid() ||
      !this.isSectionValid() ||
      !this.isExamValid()
    )
    {return;}
    
      if (this.state.isDownloadPdf === false) {
          this.setState({isDownloadPdf: true})
          const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C41CommonAcademicsAssignmentsSummaryPdfDownload?sectionId=${this.state.sectionId}&assignmentId=${this.state.assignmentId}`;
      //    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplication${type}ApplicationsExcelDownload?applicationId=${this.state.applicationId}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}${eventDataQuery}`;
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
                          tempLink.setAttribute("download", `Teacher_Exam_Summary.pdf`);
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
          this.setState({
            isDownloadPdf: false
          })
      }
  }

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
              examId: "",
              examsData: []
            });
            this.getSections(value);
            //this.getExams(this.getSectionIdFromCourseId(value));
          break;
        case "sectionId":
            this.setState({
              examId: "",
              examsData: []
            });
            this.getExams(value);
          break;
          case "examId":
            this.setState({
              examsData: []
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

  isExamValid = () => {
    let isValid = true;        
    if (!this.state.examId) {
        this.setState({examIdError:"Please select exam."});
        document.getElementById("examId").focus();
        isValid = false;
    } else {
        this.setState({examIdError:""});
    }
    return isValid;
}

  handleGetData = () => {
    if(
      !this.isCourseValid() ||
      !this.isSectionValid() ||
      !this.isExamValid()
    )
    {return;}
    this.getData(this.state.sectionId, this.state.examId);
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
      { name: "examSubmitted", title: "Submitted On" },
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
              {/* 
              <Tooltip title="Back">
                <IconButton onClick={() => window.history.back()}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip> 
              */}
              Teacher Exam Summary Report
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
              {/*
              <Tooltip title="Export PDF">
                {this.state.isDownloadPdf ?
                  <CircularProgress 
                    size={14}
                    style={{cursor: `${this.state.isDownloadPdf ? 'wait' : 'pointer'}`}}
                  />
                  :
                  <img 
                    alt="" 
                    src={PDFIcon} 
                    onClick={() => this.downloadPDFData()} 
                    style = {{
                      height: 22, 
                      width: 22,
                      marginBottom: -7,
                      cursor: `${this.state.isDownloadPdf ? 'wait' : 'pointer'}`,
                    }}
                  />
                }
              </Tooltip>
              */}
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
                id="examId"
                name="examId"
                variant="outlined"
                label="Exam"
                required
                fullWidth
                select
                onChange={this.onHandleChange}
                value={this.state.examId}
                error={!!this.state.examIdError}
                helperText={this.state.examIdError ? this.state.examIdError : " "}
                disabled={!this.state.sectionId}
              >
                {this.state.examsMenuItems && !this.state.isLoading ? 
                  this.state.examsMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"examsMenuItems"+dt.id}
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
          {this.state.examsData && !this.state.isLoading ? (
            <R206ReportsTableComponent
              data={this.state.examsData}
              columns={columns}
              showFilter={this.state.showTableFilter}
            />
          ) : (
            <Grid 
              container 
              justify="center" 
              alignItems="center"
            >
              <Grid item xs={12}>
                <br/>
              </Grid>
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
export default R206Reports;
