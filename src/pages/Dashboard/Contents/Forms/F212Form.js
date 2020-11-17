import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/styles";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Collapse} from "@material-ui/core";
import {Typography, TextField, MenuItem} from "@material-ui/core";
import ExcelIcon from "../../../../assets/Images/excel.png";
import PDFIcon from "../../../../assets/Images/pdf_export_icon.png";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchIcon from "mdi-material-ui/FileSearchOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import F212FormPopupComponent from "./F212FormPopupComponent";

import InputBase from '@material-ui/core/InputBase';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

const styles = () => ({
  root: {
    padding: 20,
    minWidth: 350,
    overFlowX: "auto",
  },
  formControl: {
    minWidth: "100%",
  },
  sectionTitle: {
    fontSize: 19,
    color: "#174a84",
  },
  checkboxDividerLabel: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 20,
    fontSize: 16,
    fontWeight: 600,
  },
  rootProgress: {
    width: "100%",
    textAlign: "center",
  },
  table: {
    //minWidth: 750,
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
   //padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 120,
    //backgroundColor: "transparent"
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    //margin: 4,
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: '1px solid '+theme.palette.common.white
  },
  body: {
    fontSize: 14,
    border: '1px solid '+theme.palette.primary.main,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover":{
      backgroundColor:"#D3D3D3"
      //backgroundColor:"#f6f8fa"
    }
  },
}))(TableRow);

function TableRowWithData(props) {

  console.log("props", props);

  const {
      rowData={}, 
      onChange, 
      isLoading, 
      applicationStatusMenuItems=[], 
      renewalStatusMenuItems=[], 
      examEntryStatusMenuItems=[], 
      pathwayMenuItems=[], 
      ...rest
    } = props;

    const classes = useStyles();
  
  return (
      <StyledTableRow key={rowData}>
        <StyledTableCell component="th" scope="row" align="center">
          {rowData.SRNo}
        </StyledTableCell>
        <StyledTableCell align="center">
          {rowData.nucluesId}
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.studentName}
          <TextField type="hidden" name="studentId" defaultValue={rowData.id}/>
        </StyledTableCell>
        <StyledTableCell align="center">
          <TextField
            id={"applicationStatus"+rowData.SRNo}
            name="applicationStatus"
            variant="outlined"
            label="Select"
            // onChange={this.onHandleChange}
            // value={this.state.schoolId}
            // error={!!this.state.schoolIdError}
            // helperText={this.state.schoolIdError ? this.state.schoolIdError : " "}
            required
            fullWidth
            select
            size="small"
          >
            {applicationStatusMenuItems ? 
              applicationStatusMenuItems.map((dt, i) => (
                <MenuItem
                  key={"schoolsMenuItems"+dt.id}
                  value={dt.id}
                >
                  {dt.label}
                </MenuItem>
              )):
              ""
            }
          </TextField>
        </StyledTableCell>
        <StyledTableCell align="center">
          <TextField
            id={"renewalStatus"+rowData.SRNo}
            name="renewalStatus"
            variant="outlined"
            label="Select"
            // onChange={this.onHandleChange}
            // value={this.state.schoolId}
            // error={!!this.state.schoolIdError}
            // helperText={this.state.schoolIdError ? this.state.schoolIdError : " "}
            required
            fullWidth
            select
            size="small"
          >
            {renewalStatusMenuItems ? 
              renewalStatusMenuItems.map((dt, i) => (
                <MenuItem
                  key={"renewalStatusMenuItems"+dt.id}
                  value={dt.id}
                >
                  {dt.label}
                </MenuItem>
              )):
              ""
            }
          </TextField>
        </StyledTableCell>
        <StyledTableCell align="center">
          <TextField
            id={"examEntryStatus"+rowData.SRNo}
            name="examEntryStatus"
            variant="outlined"
            label="Select"
            // onChange={this.onHandleChange}
            // value={this.state.schoolId}
            // error={!!this.state.schoolIdError}
            // helperText={this.state.schoolIdError ? this.state.schoolIdError : " "}
            required
            fullWidth
            select
            size="small"
          >
            {examEntryStatusMenuItems ? 
              examEntryStatusMenuItems.map((dt, i) => (
                <MenuItem
                  key={"examEntryStatusMenuItems"+dt.id}
                  value={dt.id}
                >
                  {dt.label}
                </MenuItem>
              )):
              ""
            }
          </TextField>
        </StyledTableCell>
        <StyledTableCell align="center">
          <TextField
            id={"pathwayMenuItems"+rowData.SRNo}
            name="pathwayMenuItems"
            variant="outlined"
            label="Select"
            // onChange={this.onHandleChange}
            // value={this.state.schoolId}
            // error={!!this.state.schoolIdError}
            // helperText={this.state.schoolIdError ? this.state.schoolIdError : " "}
            required
            fullWidth
            select
            size="small"
          >
            {pathwayMenuItems ? 
              pathwayMenuItems.map((dt, i) => (
                <MenuItem
                  key={"pathwayMenuItems"+dt.id}
                  value={dt.id}
                >
                  {dt.label}
                </MenuItem>
              )):
              ""
            }
          </TextField>
        </StyledTableCell>
        <StyledTableCell align="center">
          {/* <TextField
            id={`${"UOLNo"+rowData.SRNo}`}
            name="UOLNo"
            label="UOL#"
            required
            fullWidth
            variant="outlined"
            size="small"
            // onChange={this.onHandleChange}
            // value={this.state.label}
            // error={!!this.state.labelError}
            // helperText={this.state.labelError}
          /> */}
          <Paper component="form" className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="UOL#"
              inputProps={{ 'aria-label': 'UOLNo' }}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <Tooltip title="Save UOL#">
              <IconButton color="primary" className={classes.iconButton} aria-label="UOLNoSave">
                <SaveOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        </StyledTableCell>
        <StyledTableCell align="center">
          {rowData.action}
        </StyledTableCell>
      </StyledTableRow>
  );
}

class F212Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: true,
      isDownloadPdf: false,
      applicationStatusId: 1,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      tableData: [],
      schoolsMenuItems: [],
      schoolId: "",
      schoolIdError: "",
      programmeGroupId: "",
      programmeGroupIdError: "",
      programmeGroupsMenuItems: [],
      programId:"",
      programIdError:"",
      programmeGroupId:"",
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      applicationStatusMenuItems: [{id:1, label:"Missing Documents"},{id:2, label:"Offer Letter Received"},{id:1, label:"Registration Fee Paid"}],
      renewalStatusMenuItems: [{id:1, label:"Application"},{id:1, label:"Renewed"}],
      examEntryStatusMenuItems: [{id:1, label:"Course Selection"}, {id:2, label:"Exam Entry Selection"}],
      pathwayMenuItems: [{id:1, label:"New Enrollment"},{id:2, label:"Continuing Student"},{id:3, label:"Completing"}],
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

  getSchools = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonSchoolsView`;
    await fetch(url, {
      method: "POST",
      headers: new Headers({Authorization:"Bearer "+localStorage.getItem("uclAdminToken")}),
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
            this.setState({schoolsMenuItems: json.DATA || []});
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

  getProgramGroup = async (schoolId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("schoolId", schoolId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonProgrammeGroupsView`;
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
            this.setState({programmeGroupsMenuItems: json.DATA || []});
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

  getCourse = async (programmeGroupId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("programmeGroupId", programmeGroupId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonProgrammeCoursesView`;
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
            this.setState({coursesMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getCourse", json);
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

  loadModules = async (academicsSessionId, programmeId) => {
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeId", programmeId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C30CommonProgrammeModulesView`;
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
            this.setState({ preModuleMenuItems: json.DATA || [] });
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("loadModules", json);
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
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getData = async () => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("schoolId", this.state.schoolId);
    data.append("programmeGroupId", this.state.programmeGroupId);
    data.append("courseId", this.state.courseId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonStudentsView`;
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
            let data = json.DATA || [];
            let dataLength = data.length || 0;
            for (let i=0; i<dataLength; i++) {
              data[i].action = (
                <F212FormPopupComponent
                  dialogTitle={data[i].nucleusId+" - "+data[i].studentName}
                  studentId={data[i].id}
                  preModuleMenuItems={this.state.preModuleMenuItems || []}
                  preCourseMenuItems={this.state.preCourseMenuItems || []}
                  clickOnFormSubmit={() => this.clickOnFormSubmit}
                  handleOpenSnackbar={this.handleOpenSnackbar}
                />
              );
            }
            this.setState({tableData: data || []});
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

  downloadPDFData = async () => {
    if( !this.isSchoolValid() ) {return;}
      if (this.state.isDownloadPdf === false) {
          this.setState({isDownloadPdf: true})
          const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonStudentsPdfDownload?schoolId=${this.state.schoolId}&programmeGroupId=${this.state.programmeGroupId}&courseId=${this.state.courseId}`;
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
                    if(json){
                      var csvURL = window.URL.createObjectURL(json);
                      var tempLink = document.createElement("a");
                      tempLink.setAttribute("download", `Students_List.pdf`);
                      tempLink.href = csvURL;
                      tempLink.click();
                      console.log("downloadPDFData:", json);
                    }
                  },
                  error => {
                      if (error.status === 401) {
                          this.setState({
                              isLoginMenu: true,
                              isReload: false
                          })
                      } else {
                        this.handleOpenSnackbar("Failed to download, Please try again later.","error");
                        //alert('Failed to fetch, Please try again later.');
                        console.log(error);
                      }
                  });
          this.setState({
            isDownloadPdf: false
          })
      }
  }

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
        case "schoolId":
            this.setState({
              programmeGroupId: "",
              courseId:"",
              coursesMenuItems:[],
              tableData: []
            });
            this.getProgramGroup(value);
        break;
        case "programmeGroupId":
            this.setState({
              programmeGroupId: "",
              courseId:"",
              coursesMenuItems:[],
              tableData: []
            });
            this.getCourse(value);
        break;
        case "courseId":
          this.setState({tableData: []});
        break;
    default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isSchoolValid = () => {
    let isValid = true;        
    if (!this.state.schoolId) {
        this.setState({schoolIdError:"Please select school."});
        document.getElementById("schoolId").focus();
        isValid = false;
    } else {
        this.setState({schoolIdError:""});
    }
    return isValid;
  }

  isSectionValid = () => {
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

  isAssignmentValid = () => {
    let isValid = true;        
    if (!this.state.programId) {
        this.setState({programIdError:"Please select program."});
        document.getElementById("programId").focus();
        isValid = false;
    } else {
        this.setState({programIdError:""});
    }
    return isValid;
}

  handleGetData = () => {
    if(
      !this.isSchoolValid()
      //!this.isSectionValid() ||
      //!this.isAssignmentValid()
    )
    {return;}
    this.getData();
  }
  
  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  clickOnFormSubmit = () => {
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {

    if (!this.isAcademicSessionValid() || !this.isProgrammeValid()) {
      return;
    }

    let studentId = document.getElementById("studentId").value;
    let moduleNumber = document.getElementsByName("moduleNumber");
    let programmeCourseId = document.getElementsByName("programmeCourseId");
    let marks = document.getElementsByName("marks");

    let myForm = document.getElementById("myForm");
    let data = new FormData(myForm);
    data.append("studentId", studentId);
    if (moduleNumber != null) {
      for (let i = 0; i < moduleNumber.length; i++) {
        data.append("moduleNumber", moduleNumber[i].value);
        data.append("programmeCourseId", programmeCourseId[i].value);
        data.append("marks", marks[i].value);
      }
    }
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C30CommonAcademicsCoursesStudentsAchievementsSave`;
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
            setTimeout(() => {
              if (this.state.recordId != 0) {
                window.location = "#/dashboard/F09Reports";
              } else {
                window.location.reload();
              }
            }, 2000);
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getSchools();
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
        <div style={{padding:20}}>
          <Grid container justify="space-between">
            <Grid item xs={12}>
              <Typography
                style={{
                  color: "#1d5f98",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
                variant="h5"
              >
                UOL Enrolment
                <span style={{ 
                    float: "right",
                    marginBottom: -6,
                    marginTop: -12
                }}>
                  <Tooltip title="Table Filter">
                    <IconButton 
                      onClick={this.handleToggleTableFilter} 
                      style={{padding:5,marginTop:10}}
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
                </span>
              </Typography>
              <Divider
                style={{
                  backgroundColor: "rgb(58, 127, 187)",
                  opacity: "0.3",
                }}
              />
              <br/>
            </Grid>
            <Grid item xs={12}>
              <Collapse 
                in={this.state.showTableFilter} 
                timeout="auto" 
                unmountOnExit
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2}>
                    <TextField
                      id="schoolId"
                      name="schoolId"
                      variant="outlined"
                      label="Academic Session"
                      onChange={this.onHandleChange}
                      value={this.state.schoolId}
                      error={!!this.state.schoolIdError}
                      helperText={this.state.schoolIdError ? this.state.schoolIdError : " "}
                      required
                      fullWidth
                      select
                    >
                      {this.state.schoolsMenuItems && !this.state.isLoading ? 
                        this.state.schoolsMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"schoolsMenuItems"+dt.id}
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
                      id="programmeGroupId"
                      name="programmeGroupId"
                      variant="outlined"
                      label="Program Group"
                      fullWidth
                      select
                      onChange={this.onHandleChange}
                      value={this.state.programmeGroupId}
                      error={!!this.state.programmeGroupIdError}
                      helperText={this.state.programmeGroupIdError ? this.state.programmeGroupIdError : " "}
                      disabled={!this.state.schoolId}
                    >
                      {this.state.programmeGroupsMenuItems && !this.state.isLoading ? 
                        this.state.programmeGroupsMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"programmeGroupsMenuItems"+dt.id}
                            value={dt.id}
                          >
                            {dt.label}
                          </MenuItem>
                        ))
                      :
                        <Grid 
                          container 
                          justify="center"
                        >
                          <CircularProgress />
                        </Grid>
                      }
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      id="courseId"
                      name="courseId"
                      variant="outlined"
                      label="Course"
                      onChange={this.onHandleChange}
                      value={this.state.courseId}
                      error={!!this.state.courseIdError}
                      helperText={this.state.courseIdError ? this.state.courseIdError : " "}
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
                  <Grid item xs={12} md={2}>
                    <TextField
                      id="applicationStatus"
                      name="applicationStatus"
                      variant="outlined"
                      label="Application Status"
                      // onChange={this.onHandleChange}
                      // value={this.state.schoolId}
                      // error={!!this.state.schoolIdError}
                      // helperText={this.state.schoolIdError ? this.state.schoolIdError : " "}
                      required
                      fullWidth
                      select
                      disabled={!this.state.courseId}
                    >
                      <MenuItem value="1">Pending Submission</MenuItem>
                      <MenuItem value="2">Pending Response</MenuItem>
                      <MenuItem value="3">Pending Letter Acceptance</MenuItem>
                      <MenuItem value="4">Pending Missing Document</MenuItem>
                      <MenuItem value="5">Pending Registration Fee</MenuItem>
                      <MenuItem value="6">Registered</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={this.state.isLoading || !this.state.schoolId}
                      onClick={() => this.handleGetData()}
                      style={{width:"100%", height:54, marginBottom:24}}
                    > 
                      {this.state.isLoading ? <CircularProgress style={{color:'white'}} size={36}/> : "Search"}
                    </Button>
                  </Grid>
                  <Divider
                    style={{
                      backgroundColor: "rgb(58, 127, 187)",
                      opacity: "0.3",
                    }}
                  />
                </Grid>
              </Collapse>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(29, 95, 152)', width:20}}>SR#</StyledTableCell>
                      <StyledTableCell align="center">NucleusID</StyledTableCell>
                      <StyledTableCell align="center">Student Name</StyledTableCell>
                      <StyledTableCell align="center" style={{minWidth:85}}>Application Status</StyledTableCell>
                      <StyledTableCell align="center" style={{minWidth:85}}>Renewal Status</StyledTableCell>
                      <StyledTableCell align="center" style={{minWidth:85}}>Exam Entry Status</StyledTableCell>
                      <StyledTableCell align="center" style={{minWidth:85}}>Pathway</StyledTableCell>
                      <StyledTableCell align="center" style={{width:100}}>UOL#</StyledTableCell>
                      <StyledTableCell align="center" style={{borderRight:'1px solid rgb(29, 95, 152)', width:70}}>Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.state.tableData.length > 0 ? (
                    this.state.tableData.map((row, index) => (
                      <TableRowWithData
                        key={"SED"+row+index}
                        rowData={row}
                        applicationStatusMenuItems={this.state.applicationStatusMenuItems}
                        renewalStatusMenuItems={this.state.renewalStatusMenuItems}
                        examEntryStatusMenuItems={this.state.examEntryStatusMenuItems}
                        pathwayMenuItems={this.state.pathwayMenuItems}
                        isLoading={this.state.isLoading}
                      />
                    ))
                  ) : 
                  this.state.isLoading ? 
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={9}><center><CircularProgress disableShrink/></center></StyledTableCell>
                    </StyledTableRow>
                    :
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={9}><center><b>No Data</b></center></StyledTableCell>
                    </StyledTableRow>
                  }
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
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

export default  withStyles(styles)(F212Form);
