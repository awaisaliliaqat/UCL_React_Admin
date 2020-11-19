import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/styles";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Collapse} from "@material-ui/core";
import {Typography, TextField, MenuItem} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import FilterIcon from "mdi-material-ui/FilterOutline";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
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

  console.log("props", 1);

  const {
      rowIndex,
      rowData={}, 
      onChange, 
      isLoading, 
      applicationStatusMenuItems=[], 
      renewalStatusMenuItems=[], 
      examEntryStatusMenuItems=[], 
      pathwayMenuItems=[],
      onFormSubmit,
      ...rest
    } = props;

  const classes = useStyles();
  
  return (
      <StyledTableRow key={rowData}>
        <StyledTableCell component="th" scope="row" align="center">
          {rowData.SRNo}
        </StyledTableCell>
        <StyledTableCell align="center">
          {rowData.studentId}
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.displayName}
          <TextField 
            type="hidden" 
            name="studentId"
            defaultValue={rowData.id}
            inputProps={{
              id:"studentId"+rowIndex
            }}
          />
        </StyledTableCell>
        <StyledTableCell align="center">
          <TextField
            name="applicationStatusId"
            variant="outlined"
            label="Select"
            defaultValue={rowData.applicationStatusId}
            onChange={()=>onFormSubmit(rowIndex)}
            required
            fullWidth
            select
            size="small"
            inputProps={{
              id:"applicationStatusId"+rowIndex
            }}
          >
            <MenuItem value={0}>Select</MenuItem>
            {applicationStatusMenuItems.map((dt, i) => (
                <MenuItem
                  key={"applicationStatusMenuItems"+dt.id}
                  value={dt.id}
                >
                  {dt.label}
                </MenuItem>
            ))}
          </TextField>
        </StyledTableCell>
        <StyledTableCell align="center">
          <TextField
            name="renewalStatusId"
            variant="outlined"
            label="Select"
            defaultValue={rowData.renewalStatusId}
            onChange={()=>onFormSubmit(rowIndex)}
            required
            fullWidth
            select
            size="small"
            inputProps={{
              id:"renewalStatusId"+rowIndex
            }}
          >
             <MenuItem value={0}>Select</MenuItem>
            {renewalStatusMenuItems.map((dt, i) => (
                <MenuItem
                  key={"renewalStatusId"+dt.id}
                  value={dt.id}
                >
                  {dt.label}
                </MenuItem>
            ))}
          </TextField>
        </StyledTableCell>
        <StyledTableCell align="center">
          <TextField
            name="examEntryStatusId"
            variant="outlined"
            label="Select"
            defaultValue={rowData.examEntryStatusId}
            onChange={()=>onFormSubmit(rowIndex)}
            required
            fullWidth
            select
            size="small"
            inputProps={{
              id: "examEntryStatusId"+rowIndex
            }}
          >
             <MenuItem value={0}>Select</MenuItem>
            {examEntryStatusMenuItems.map((dt, i) => (
                <MenuItem
                  key={"examEntryStatusMenuItems"+dt.id}
                  value={dt.id}
                >
                  {dt.label}
                </MenuItem>
            ))}
          </TextField>
        </StyledTableCell>
        <StyledTableCell align="center">
          <TextField
            name="pathwayId"
            variant="outlined"
            label="Select"
            defaultValue={rowData.pathwayId}
            onChange={()=>onFormSubmit(rowIndex)}
            required
            fullWidth
            select
            size="small"
            inputProps={{
              id: "pathwayId"+rowIndex
            }}
          >
            <MenuItem value={0}>Select</MenuItem>
            {pathwayMenuItems.map((dt, i) => (
                <MenuItem
                  key={"pathwayMenuItems"+dt.id}
                  value={dt.id}
                >
                  {dt.label}
                </MenuItem>
            ))}
          </TextField>
        </StyledTableCell>
        <StyledTableCell align="center">
          <Paper component="form" className={classes.root}>
            <InputBase
              id={`${"UOLNo"+rowIndex}`}
              name="UOLNo"
              defaultValue={rowData.uolNumber}
              className={classes.input}
              placeholder="UOL#"
              inputProps={{ 'aria-label': 'UOLNo' }}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <Tooltip title="Save UOL#">
              <IconButton color="primary" className={classes.iconButton} aria-label="UOLNoSave" onClick={()=>onFormSubmit(rowIndex)}>
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
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      tableData: [],
      academicSessionMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      programmeGroupId: "",
      programmeGroupIdError: "",
      programmeGroupsMenuItems: [],
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      applicationStatusMenuItems: [],
      applicationStatus: 0,
      applicationStatusError: "",
      renewalStatusMenuItems: [],
      renewalStatus: 0,
      renewalStatusError: "",
      examEntryStatusMenuItems: [],
      examEntryStatus: 0,
      examEntryStatusError: "",
      pathwayMenuItems: [],
      pathway: 0,
      pathwayError: ""
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

  loadAcademicSessions = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonAcademicSessionsView`;
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
              this.loadProgrammeGroups(res.ID);
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

  loadProgrammeGroups = async (academicsSessionId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonAcademicsSessionsOfferedProgrammesGroupView`;
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
          console.log("loadSections", json);
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

  loadCourse = async (academicsSessionId, programmeGroupId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeGroupId", programmeGroupId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonAcademicsSessionsOfferedCoursesView`;
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
          console.log("loadCourse", json);
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

  loadApplicationStatus = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonUolEnrollmentApplicationStatusView`;
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
            this.setState({applicationStatusMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadApplicationStatus", json);
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

  loadRenewalStatus = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonUolEnrollmentRenewalStatusView`;
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
            this.setState({renewalStatusMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadRenewalStatus", json);
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

  loadExamEntryStatus = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonUolEnrollmentExamEntryStatusView`;
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
            this.setState({examEntryStatusMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadExamEntryStatus", json);
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

  loadPathway = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonUolEnrollmentPathwayView`;
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
            this.setState({pathwayMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadPathway", json);
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

  loadData = async () => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("academicSessionId", this.state.academicSessionId);
    data.append("programmeGroupId", this.state.programmeGroupId);
    data.append("courseId", this.state.courseId);
    data.append("applicationStatusId", this.state.applicationStatus);
    data.append("renewalStatusId", this.state.renewalStatus);
    data.append("examEntryStatusId", this.state.examEntryStatus);
    data.append("pathwayId", this.state.pathway);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonStudentsView`;
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
                // <F212FormPopupComponent
                //   dialogTitle={data[i].nucleusId+" - "+data[i].studentName}
                //   studentId={data[i].id}
                //   preModuleMenuItems={this.state.preModuleMenuItems || []}
                //   preCourseMenuItems={this.state.preCourseMenuItems || []}
                //   clickOnFormSubmit={() => this.clickOnFormSubmit}
                //   handleOpenSnackbar={this.handleOpenSnackbar}
                // />
                ""
              );
            }
            this.setState({tableData: data || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadData", json);
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

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    switch (name) {
        case "academicSessionId":
          this.setState({
            programmeGroupId: "",
            programmeGroupsMenuItems: [],
            courseId: "",
            coursesMenuItems: [],
            tableData:[]
          });
          this.loadProgrammeGroups(value);
        break;
        case "programmeGroupId":
            this.setState({
              programmeGroupId: "",
              courseId:"",
              coursesMenuItems:[],
              tableData: []
            });
            this.loadCourse(this.state.academicSessionId, value);
        break;
        case "courseId":
          this.setState({
            courseId: "",
            tableData: []
          });
        break;
      default:
    }

    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isAcademicSessionValid = () => {
    let isValid = true;
    if (!this.state.academicSessionId) {
      this.setState({
        academicSessionIdError: "Please select Academic Session.",
      });
      document.getElementById("academicSessionId").focus();
      isValid = false;
    } else {
      this.setState({ academicSessionIdError: "" });
    }
    return isValid;
  };

  isProgrammeGroupValid = () => {
    let isValid = true;
    if (!this.state.programmeGroupId) {
      this.setState({ programmeGroupIdError: "Please select programme group." });
      document.getElementById("programmeGroupId").focus();
      isValid = false;
    } else {
      this.setState({ programmeGroupIdError: "" });
    }
    return isValid;
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

  
  handleGetData = () => {
    if(
      !this.isAcademicSessionValid()
      || !this.isProgrammeGroupValid()
      || !this.isCourseValid()
    ){return;}
    this.setState({tableData:[]});
    this.loadData();
  }
  
  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  clickOnFormSubmit = (rowIndex) => {
    setTimeout( () => { this.onFormSubmit(rowIndex); }, 0);
  };

  onFormSubmit = async (rowIndex) => {

    if (
      !this.isAcademicSessionValid() 
      || !this.isProgrammeGroupValid()
      || !this.isCourseValid()
    ) { return; }
    
    let studentId = document.getElementById("studentId"+rowIndex).value;
    let applicationStatusId = document.getElementById("applicationStatusId"+rowIndex).value;
    let renewalStatusId = document.getElementById("renewalStatusId"+rowIndex).value;
    let examEntryStatusId = document.getElementById("examEntryStatusId"+rowIndex).value;
    let pathwayId = document.getElementById("pathwayId"+rowIndex).value;
    let UOLNo = document.getElementById("UOLNo"+rowIndex).value;

    let data = new FormData();
    data.append("academicSessionId", this.state.academicSessionId);
    data.append("studentId", studentId);
    data.append("applicationStatusId", applicationStatusId);
    data.append("renewalStatusId", renewalStatusId);
    data.append("examEntryStatusId", examEntryStatusId);
    data.append("pathwayId", pathwayId);
    data.append("uolNumber", UOLNo);
    
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonUolEnrollmentSave`;
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
            // setTimeout(() => {
            //   if (this.state.recordId != 0) {
            //     window.location = "#/dashboard/F09Reports";
            //   } else {
            //     window.location.reload();
            //   }
            // }, 2000);
          } else {
            this.handleOpenSnackbar(json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,"error");
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
    this.loadAcademicSessions();
    this.loadApplicationStatus();
    this.loadRenewalStatus();
    this.loadExamEntryStatus();
    this.loadPathway();
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
                      {this.state.academicSessionMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"academicSessionMenuItems"+dt.ID}
                          value={dt.ID}
                        >
                          {dt.Label}
                        </MenuItem>
                      ))}
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
                      required
                      onChange={this.onHandleChange}
                      value={this.state.programmeGroupId}
                      error={!!this.state.programmeGroupIdError}
                      helperText={this.state.programmeGroupIdError}
                      disabled={!this.state.academicSessionId}
                    >
                      {this.state.programmeGroupsMenuItems && !this.state.isLoading ? 
                        this.state.programmeGroupsMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"programmeGroupsMenuItems"+dt.Id}
                            value={dt.Id}
                          >
                            {dt.Label}
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
                      required
                      onChange={this.onHandleChange}
                      value={this.state.courseId}
                      error={!!this.state.courseIdError}
                      helperText={this.state.courseIdError}
                      fullWidth
                      select
                    >
                      {this.state.coursesMenuItems && !this.state.isLoading ? 
                        this.state.coursesMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"coursesMenuItems"+dt.id}
                            value={dt.id}
                          >
                            {dt.courseLabel}
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
                      id="applicationStatus"
                      name="applicationStatus"
                      variant="outlined"
                      label="Application Status"
                      onChange={this.onHandleChange}
                      value={this.state.applicationStatus}
                      error={!!this.state.applicationStatusError}
                      helperText={this.state.applicationStatusError}
                      fullWidth
                      select
                      disabled={!this.state.courseId}
                    >
                      <MenuItem value={0}>Any</MenuItem>
                      {this.state.applicationStatusMenuItems ? 
                        this.state.applicationStatusMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"applicationStatusMenuItems"+dt.id}
                            value={dt.id}
                          >
                            {dt.label}
                          </MenuItem>
                        ))
                        :
                        ""
                      }
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      id="renewalStatus"
                      name="renewalStatus"
                      variant="outlined"
                      label="Renewal Status"
                      onChange={this.onHandleChange}
                      value={this.state.renewalStatus}
                      error={!!this.state.renewalStatusError}
                      helperText={this.state.renewalStatusError}
                      fullWidth
                      select
                      disabled={!this.state.courseId}
                    >
                      <MenuItem value={0}>Any</MenuItem>
                      {this.state.renewalStatusMenuItems ? 
                        this.state.renewalStatusMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"renewalStatusMenuItems"+dt.id}
                            value={dt.id}
                          >
                            {dt.label}
                          </MenuItem>
                        ))
                        :
                        ""
                      }
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      id="examEntryStatus"
                      name="examEntryStatus"
                      variant="outlined"
                      label="Exam Entry Status"
                      onChange={this.onHandleChange}
                      value={this.state.examEntryStatus}
                      error={!!this.state.examEntryStatusError}
                      helperText={this.state.examEntryStatusError}
                      fullWidth
                      select
                      disabled={!this.state.courseId}
                    >
                      <MenuItem value={0}>Any</MenuItem>
                      {this.state.examEntryStatusMenuItems ? 
                        this.state.examEntryStatusMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"examEntryStatusMenuItems"+dt.id}
                            value={dt.id}
                          >
                            {dt.label}
                          </MenuItem>
                        ))
                        :
                        ""
                      }
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      id="pathway"
                      name="pathway"
                      variant="outlined"
                      label="Pathway"
                      onChange={this.onHandleChange}
                      value={this.state.pathway}
                      error={!!this.state.pathwayError}
                      helperText={this.state.pathwayError}
                      fullWidth
                      select
                      disabled={!this.state.courseId}
                    >
                      <MenuItem value={0}>Any</MenuItem>
                      {this.state.pathwayMenuItems ? 
                        this.state.pathwayMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"pathwayMenuItems"+dt.id}
                            value={dt.id}
                          >
                            {dt.label}
                          </MenuItem>
                        ))
                        :
                        ""
                      }
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={this.state.isLoading || !this.state.courseId}
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
                        rowIndex={index}
                        applicationStatusMenuItems={this.state.applicationStatusMenuItems}
                        renewalStatusMenuItems={this.state.renewalStatusMenuItems}
                        examEntryStatusMenuItems={this.state.examEntryStatusMenuItems}
                        pathwayMenuItems={this.state.pathwayMenuItems}
                        isLoading={this.state.isLoading}
                        onFormSubmit={this.clickOnFormSubmit}
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
