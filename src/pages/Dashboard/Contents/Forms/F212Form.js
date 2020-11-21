import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/styles";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Collapse, Fab, } from "@material-ui/core";
import {Typography, TextField, MenuItem} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import FilterIcon from "mdi-material-ui/FilterOutline";
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import F212FormChangeStatusPopup from "./F212FormChangeStatusPopup";
import F212FormPopupComponent from "./F212FormPopupComponent";
import F212FormTableComponent from "./F212FormTableComponent";
import InputBase from '@material-ui/core/InputBase';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import AddIcon from "@material-ui/icons/Add";

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

class F212Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showSearchFilter: true,
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
      programmeId: "",
      programmeIdError: "",
      programmeMenuItems: [],
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
      pathwayError: "",
      preCourseMenuItems: [],
      f212FormPopupIsOpen: false,
      f212FormPopupData: {
        studentId: "", 
        studentNucleusId: "", 
        studentName: ""
      },
      f212FormChangeStatusPopupIsOpen: false,
      f212FormChangeStatusPopupData: {
        studentId: "", 
        studentNucleusId: "", 
        studentName: "",
        applicationStatusId: "",
        renewalStatusId: "",
        examEntryStatusId: "",
        pathwayId: "",
        uolNumber: ""
      }
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

  loadProgrammes = async (programmeGroupId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("programmeGroupId", programmeGroupId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonProgrammesView`;
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
            this.setState({programmeMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadProgrammes", json);
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonProgrammeModulesView`;
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
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadProgrammeCourses = async (academicsSessionId, programmeId) => {
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeId", programmeId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonProgrammeCoursesView`;
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
            this.setState({ preCourseMenuItems: json.DATA || [] });
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("loadProgrammeCourses", json);
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

  loadData = async () => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("academicSessionId", this.state.academicSessionId);
    data.append("programmeGroupId", this.state.programmeGroupId);
    data.append("programmeId", this.state.programmeId);
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

              let f212FormPopupData = {
                studentId: data[i].id,
                studentNucleusId: data[i].studentId,
                studentName: data[i].displayName
              };

              data[i].action = (
                <IconButton
                  color="primary"
                  aria-label="Add"
                  onClick={()=>this.f212FormPopupSetData(f212FormPopupData)}
                  variant="outlined"
                  component="span"
                  style={{padding:5}}
                >
                  <Tooltip title="Add / Change">
                    <Fab 
                      color="primary" 
                      aria-label="add" 
                      size="small"
                    >
                      <AddIcon fontSize="small"/>
                    </Fab>
                  </Tooltip>
                </IconButton>
              );

              let f212FormChangeStatusPopupData = {
                studentId: data[i].id,
                studentNucleusId: data[i].studentId,
                studentName: data[i].displayName,
                applicationStatusId: data[i].applicationStatusId,
                renewalStatusId: data[i].renewalStatusId,
                examEntryStatusId: data[i].examEntryStatusId,
                pathwayId: data[i].pathwayId,
                uolNumber: data[i].uolNumber
              };

              data[i].changeStatusAction = (
                <IconButton
                  color="primary"
                  aria-label="Add"
                  onClick={()=>this.f212FormChangeStatusPopupSetData(f212FormChangeStatusPopupData)}
                  variant="outlined"
                  component="span"
                  style={{padding:5}}
                >
                  <Tooltip title="Add / Change">
                    <Fab 
                      color="primary" 
                      aria-label="add" 
                      size="small"
                    >
                      <AddIcon fontSize="small"/>
                    </Fab>
                  </Tooltip>
                </IconButton>
              );

            }
            this.setState({tableData: data});
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
            //this.loadCourse(this.state.academicSessionId, value);
            this.loadProgrammes(value);
        break;
        case "programmeId":
          this.setState({
            programmeId: "",
            preCourseMenuItems: [],
            tableData: []
          });
          this.loadModules(this.state.academicSessionId, value);
          this.loadProgrammeCourses(this.state.academicSessionId, value);
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

  isProgrammeValid = () => {
    let isValid = true;
    if (!this.state.programmeId) {
      this.setState({ programmeIdError: "Please select programme." });
      document.getElementById("programmeId").focus();
      isValid = false;
    } else {
      this.setState({ programmeIdError: "" });
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
      || !this.isProgrammeValid
      //|| !this.isCourseValid()
    ){return;}
    this.setState({tableData:[]});
    this.loadData();
  }
  
  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  handleToggleSearchFilter = () => {
    this.setState({ showSearchFilter: !this.state.showSearchFilter });
  };

  f212FormPopupOpen = () => {
    this.setState({f212FormPopupIsOpen: true});
  }

  f212FormPopupClose = () => {
    this.setState({f212FormPopupIsOpen: false});
  }

  f212FormPopupSetData = (data) => {
    this.setState({
      f212FormPopupData: {
        studentId: data.studentId, 
        studentNucleusId: data.studentNucleusId,
        studentName: data.studentName
      }
    });
    this.f212FormPopupOpen();
  }

  f212FormChangeStatusPopupOpen = () => {
    this.setState({f212FormChangeStatusPopupIsOpen: true});
  }

  f212FormChangeStatusPopupClose = () => {
    this.setState({f212FormChangeStatusPopupIsOpen: false});
  }

  f212FormChangeStatusPopupSetData = (data) => {
    this.setState({
      f212FormChangeStatusPopupData: {
        studentId: data.studentId, 
        studentNucleusId: data.studentNucleusId,
        studentName: data.studentName,
        applicationStatusId: data.applicationStatusId,
        renewalStatusId: data.renewalStatusId,
        examEntryStatusId: data.examEntryStatusId,
        pathwayId: data.pathwayId,
        uolNumber: data.uolNumber
      }
    });
    this.f212FormChangeStatusPopupOpen();
  }

  onChangeStatusFormSubmit = async () => {

    if (
      !this.isAcademicSessionValid() 
      || !this.isProgrammeGroupValid()
      || !this.isProgrammeValid()
    ) { return; }

    let studentId = document.getElementById("studentId").value;
    let applicationStatusId = document.getElementById("applicationStatusId").value;
    let renewalStatusId = document.getElementById("renewalStatusId").value;
    let examEntryStatusId = document.getElementById("examEntryStatusId").value;
    let pathwayId = document.getElementById("pathwayId").value;
    let UOLNo = document.getElementById("UOLNo").value;

    let applicationStatusLabel = ""; 
    let asObj = this.state.applicationStatusMenuItems.find( (obj) => obj.id == applicationStatusId);
    if(asObj){
      applicationStatusLabel = asObj.label;
    }

    let renewalStatusLabel = ""; 
    let rsObj = this.state.renewalStatusMenuItems.find( (obj) => obj.id == renewalStatusId);
    if(rsObj){
      renewalStatusLabel = rsObj.label;
    }
    
    let examEntryStatusLabel = ""; 
    let eesObj = this.state.examEntryStatusMenuItems.find( (obj) => obj.id == examEntryStatusId);
    if(eesObj){
      examEntryStatusLabel = eesObj.label;
    }
    
    let pathwayLabel = ""; 
    let pwObj = this.state.pathwayMenuItems.find( (obj) => obj.id == pathwayId);
    if(pwObj){
      pathwayLabel = pwObj.label;
    }

    let data = new FormData();
    data.append("academicSessionId", this.state.academicSessionId);
    data.append("studentId", studentId);
    data.append("applicationStatusId", applicationStatusId);
    data.append("renewalStatusId", renewalStatusId);
    data.append("examEntryStatusId", examEntryStatusId);
    data.append("pathwayId", pathwayId);
    data.append("uolNumber", UOLNo);
    
    let abc1 = [...this.state.tableData];
    
    let aaa = abc1.map((row, index) => { 
      
      let row10 = { ...row };
      
      if(row.id == studentId){
        
        row10.applicationStatusId = applicationStatusId;
        row10.applicationStatusLabel = applicationStatusLabel;
        row10.renewalStatusId = renewalStatusId;
        row10.renewalStatusLabel = renewalStatusLabel;
        row10.examEntryStatusId = examEntryStatusId;
        row10.examEntryStatusLabel = examEntryStatusLabel;
        row10.pathwayId = pathwayId;
        row10.pathwayLabel = pathwayLabel;
        row10.uolNumber = UOLNo;

        let f212FormChangeStatusPopupData = {
          studentId: row.id,
          studentNucleusId: row.studentId,
          studentName: row.displayName,
          applicationStatusId: applicationStatusId,
          renewalStatusId: renewalStatusId,
          examEntryStatusId: examEntryStatusId,
          pathwayId: pathwayId,
          uolNumber: UOLNo
        };

        row10.changeStatusAction = (
          <IconButton
            color="primary"
            aria-label="Add"
            onClick={()=>this.f212FormChangeStatusPopupSetData(f212FormChangeStatusPopupData)}
            variant="outlined"
            component="span"
            style={{padding:5}}
          >
            <Tooltip title="Add / Change">
              <Fab 
                color="primary" 
                aria-label="add" 
                size="small"
              >
                <AddIcon fontSize="small"/>
              </Fab>
            </Tooltip>
          </IconButton>
        );

      }
      
      return ( 
        row.id == studentId ? { ...row10 } : row 
      )} 

    );

    this.setState({tableData: aaa });
  
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
            this.f212FormChangeStatusPopupClose();
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

  onStudentAchievementFormSubmit = async (e) => {

    if (
        !this.isAcademicSessionValid() 
        || !this.isProgrammeValid()
      ) { return; }

    let studentId = document.getElementById("studentId").value;
    let moduleNumber = document.getElementsByName("moduleNumber");
    let programmeCourseId = document.getElementsByName("programmeCourseId");
    let marks = document.getElementsByName("marks");

    let data = new FormData();
    data.append("academicSessionId", this.state.academicSessionId);
    data.append("programmeId", this.state.programmeId);
    data.append("studentId", studentId);

    if (moduleNumber.length>0) {
      for (let i = 0; i < moduleNumber.length; i++) {
        data.append("moduleNumber", moduleNumber[i].value);
        data.append("programmeCourseId", programmeCourseId[i].value);
        data.append("marks", marks[i].value);
      }
    }else{
      this.handleOpenSnackbar("Please add at least one achievement.","error");
      return;
    }
    
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonAcademicsCoursesStudentsAchievementsSave`;
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
            <F212FormChangeStatusPopup
              isOpen={this.state.f212FormChangeStatusPopupIsOpen}
              data={this.state.f212FormChangeStatusPopupData}
              applicationStatusMenuItems={this.state.applicationStatusMenuItems}
              renewalStatusMenuItems={this.state.renewalStatusMenuItems} 
              examEntryStatusMenuItems={this.state.examEntryStatusMenuItems} 
              pathwayMenuItems={this.state.pathwayMenuItems}
              onFormSubmit={() => this.onChangeStatusFormSubmit}
              handleOpenSnackbar={this.handleOpenSnackbar}
              handleClose={this.f212FormChangeStatusPopupClose}
            />
            <F212FormPopupComponent
              isOpen={this.state.f212FormPopupIsOpen}
              data={this.state.f212FormPopupData}
              preModuleMenuItems={this.state.preModuleMenuItems}
              preCourseMenuItems={this.state.preCourseMenuItems}
              onFormSubmit ={() => this.onStudentAchievementFormSubmit}
              handleOpenSnackbar={this.handleOpenSnackbar}
              f212FormPopupClose={this.f212FormPopupClose}
            />
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
                  <Tooltip title="Search Filter">
                    <IconButton 
                      onClick={this.handleToggleSearchFilter} 
                      style={{padding:5,marginTop:10}}
                    >
                      <FilterListOutlinedIcon fontSize="default" color="primary" />
                    </IconButton>
                  </Tooltip>
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
                in={this.state.showSearchFilter} 
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
                      {this.state.programmeGroupsMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"programmeGroupsMenuItems"+dt.Id}
                            value={dt.Id}
                          >
                            {dt.Label}
                          </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      id="programmeId"
                      name="programmeId"
                      variant="outlined"
                      label="Programme"
                      required
                      onChange={this.onHandleChange}
                      value={this.state.programmeId}
                      error={!!this.state.programmeIdError}
                      helperText={this.state.programmeIdError}
                      fullWidth
                      select
                    >
                      {this.state.programmeMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"programmeMenuItems"+dt.ID}
                            value={dt.ID}
                          >
                            {dt.Label}
                          </MenuItem>
                      ))}
                    </TextField>
                    {/* 
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
                    */}
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
                      disabled={!this.state.programmeGroupId}
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
                      disabled={!this.state.programmeGroupId}
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
                      disabled={!this.state.programmeGroupId}
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
                      disabled={!this.state.programmeGroupId}
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
                      disabled={this.state.isLoading || !this.state.programmeId}
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
              <F212FormTableComponent
                rows={this.state.tableData}
                showFilter={this.state.showTableFilter}
              />
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
