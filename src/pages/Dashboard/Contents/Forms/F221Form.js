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
import F221FormTableComponent from "./F221FormTableComponent";
import InputBase from '@material-ui/core/InputBase';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from '@material-ui/icons/Clear';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import BottomBar from "../../../../components/BottomBar/BottomBar";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

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

class F221Form extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showSearchFilter: true,
      showTableFilter: false,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      isPromoteAll: false,
      isWithdrawnAll: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      tableData: [],
      academicSessionMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      newAcademicSessionMenuItems: [],
      newAcademicSessionId: "",
      newAcademicSessionIdError: "",
      programmeGroupId: "",
      programmeGroupIdError: "",
      programmeGroupsMenuItems: [],
      newProgrammeGroupId: "",
      newProgrammeGroupIdError: "",
      newProgrammeGroupsMenuItems: [],
      programmeId: "",
      programmeIdError: "",
      programmeMenuItems: [],
      newProgrammeId: "",
      newProgrammeIdError: "",
      newProgrammeMenuItems: [],
      coursesMenuItems: [],
      courseId: "",
      courseIds: "",
      courseIdError: "",
      applicationStatusFilterMenuItems: [],
      applicationStatusFilterId: 0,
      applicationStatusFilterIdError: "",
      applicationStatusMenuItems: [],
      applicationStatus: 0,
      applicationStatusError: "",
      renewalStatusMenuItems: [],
      renewalStatus: 0,
      renewalStatusError: "",
      examEntryStatusMenuItems: [],
      examEntryStatus: 0,
      examEntryStatusError: "",
      courseCompletionStatusMenuItems: [],
      courseCompletionStatus: 0,
      courseCompletionError: "",
      endYearAchievementMenuItems: [],
      endYearAchievement: 0,
      endYearAchievementError: "",
      pathwayMenuItems: [],
      pathway: 0,
      newAcademicSessionId: "",
      pathwayError: "",
      preCourseMenuItems: [],
      preCourseSelectionItems: [],
      f212FormPopupIsOpen: false,
      f212FormPopupData: {
        studentId: "", 
        studentNucleusId: "", 
        studentName: ""
      },
     
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
  handlePromoteAll=(e)=>{
   
    if(e.target.checked==true){
      this.setState({
        isPromoteAll :true,
        isWithdrawnAll : false
      });
      var els=document.getElementsByName('promote');
      var els2=document.getElementsByName('widthdrawn');
       for (var i=0, len = els.length; i<len; i++) {
           els[i].checked = false;
           els2[i].checked = true;
       }
    }else{
      this.setState({
        isPromoteAll :false,
        isWithdrawnAll : false
      });
      var els=document.getElementsByName('promote');
      var els2=document.getElementsByName('widthdrawn');
       for (var i=0, len = els.length; i<len; i++) {
           els[i].checked = false;
           els2[i].checked = false;
       }
    }
  }
  handleWithdrawnAll=(e)=>{
    if(e.target.checked==true){
      this.setState({
        isWithdrawnAll :true,
        isPromoteAll : false
      });
         var els=document.getElementsByName('promote');
         var els2=document.getElementsByName('widthdrawn');
          for (var i=0, len = els.length; i<len; i++) {
              els[i].checked = true;
              els2[i].checked=false;
          }
    }else{
      this.setState({
        isWithdrawnAll :false,
        isPromoteAll : false
      });
      var els=document.getElementsByName('promote');
         var els2=document.getElementsByName('widthdrawn');
          for (var i=0, len = els.length; i<len; i++) {
              els[i].checked = false;
              els2[i].checked = false;
          }
      
    }
    console.log(e.target.checked==true);
  }
  onAllClick = () => {
    var els=document.getElementsByName('promote');
    var els2=document.getElementsByName('widthdrawn');
       for (var i=0, len = els.length; i<len; i++) {
           els[i].checked = false;
           els2[i].checked = false;
       }
      this.setState({
        isPromoteAll:false,
        isWithdrawnAll:false
      });
      
      // document.getElementsByName('isPromoteAll').checked==false;
}
  onCheckClickB = (index) =>{
    console.log(document.getElementById("widthdrawn"+index));
    document.getElementById("widthdrawn"+index).checked = false;
  }
  onCheckClickA = (index) =>{
    console.log(document.getElementById("promote"+index));
    document.getElementById("promote"+index).checked = false;
  }

  loadAcademicSessions = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C221CommonAcademicSessionsView`;
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
              console.log(this.state.academicSessionId)
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

  loadNewAcademicSessions = async (newAcademicSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", newAcademicSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C221CommonAcademicSessionsNewView`;
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
            let array = json.DATA || [];
            let arrayLength = array.length;
            let res = array.find( (obj) => obj.isActive === 1 );
            this.setState({newAcademicSessionId:array[0].ID});
            this.loadNewProgrammeGroups(this.state.newAcademicSessionId);
            
            if(res){
              this.setState({newAcademicSessionId:res.ID});
              this.loadNewProgrammeGroups(res.ID);
            }
            this.setState({ newAcademicSessionMenuItems: array });
            
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C221CommonAcademicsSessionsOfferedProgrammesGroupView`;
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

  loadNewProgrammeGroups = async (academicsSessionId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C221CommonAcademicsSessionsOfferedProgrammesGroupView`;
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
            this.setState({newProgrammeGroupsMenuItems: json.DATA || []});
            this.setState({newProgrammeGroupId: this.state.programmeGroupId});
            this.loadNewProgrammes(this.state.newProgrammeGroupId);
           
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C221CommonProgrammesView`;
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

  loadNewProgrammes = async (programmeGroupId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("programmeGroupId", programmeGroupId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C221CommonProgrammesView`;
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
            this.setState({newProgrammeMenuItems: json.DATA || []});
            this.setState({newProgrammeId: this.state.programmeId});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("newProgrammeMenuItems", json);
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

 
  loadApplicationStatusFilter = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonUolEnrollmentApplicationStatusFilterView`;
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
            this.setState({applicationStatusFilterMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadApplicationStatusFilter", json);
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
  loadCourseCompletionStatus = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonUolEnrollmentCoursesCompletionStatusView`;
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
            this.setState({courseCompletionStatusMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadCourseCompletionStatus", json);
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
  loadEndYearAchievement = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonUolEnrollmentYearEndAchievementView`;
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
            this.setState({endYearAchievementMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadEndYearAchievement", json);
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

  loadModules = async (academicsSessionId, programmeId=0) => {
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    // data.append("programmeId", programmeId);
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
    data.append("programmeId",  this.state.programmeId);
    this.loadNewAcademicSessions(this.state.academicSessionId);
    // data.append("courseId", "82");
    // data.append("applicationStatusFilterId", "");
    // data.append("renewalStatusId", "");
    // data.append("examEntryStatusId", "");
    // data.append("courseCompletionStatusId", "");
    // data.append("endYearAchievementId", "");
    // data.append("pathwayId", "");
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C221CommonStudentsView`;
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
            this.loadNewAcademicSessions(this.state.academicSessionId);
            let data = json.DATA || [];
            let dataLength = data.length || 0;

            for (let i=0; i<dataLength; i++) {
              
              data[i].action = (
                
             
                <Fragment>
                  <form>
                  <input type="hidden" name="recordId"value={data[i].id} />
                  <input type="hidden" name="programmeGroupId" value={this.state.newProgrammeGroupId}/>
                  <input type="hidden" name="studentIds" value={data[i].studentId} />
                  <input type="hidden" name="pathwayId" value={data[i].pathwayId} />
                  <input type="hidden" name="programmeId" value={this.state.newprogramId} />
                  <input type="checkbox" name={"promote"} id={"promote"+i} 
                    style={{
                      "height": "1.2rem",
                      "width": "100%"
                    }}
                    onChange={() => this.onCheckClickB(i)}
                    />
                  </form>
                  
                  
                </Fragment>
                
              );
              data[i].changeStatusAction = (
                <input 
                type="checkbox"
                style={{
                  color: "primary",
                  "height": "1.2rem",
                  "width": "100%"
                }}
                name={"widthdrawn"}
                id={"widthdrawn"+i}
                onChange={() => this.onCheckClickA(i)}
                 />
              );
            }
            // this.state.tableData.add({
            //   "Roshaan": "Rao",
            //   "displayName" : "displayName"

            // })
         

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

  onHandleChange2 = (e) => {
    const { name, value } = e.target;
    this.setState({
      newAcademicSessionId: value
    });
  }
  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    switch (name) {
        case "academicSessionId":
          this.setState({
            programmeGroupId: "",
            programmeGroupsMenuItems: [],
          
          });
          this.loadNewProgrammes(value);
          this.loadProgrammeGroups(value);
          this.loadNewAcademicSessions(value);
        break;
       
        case "programmeGroupId":
            this.setState({
              programmeGroupId: "",
              courseId:"",
              coursesMenuItems:[],
              tableData: []
            });
            // this.loadCourse(this.state.academicSessionId, value);
            // this.loadModules(this.state.academicSessionId, value);
             this.loadProgrammes(value);
        break;
        case "programmeId":
          this.setState({
            programmeId: "",
            preCourseMenuItems: [],
            preCourseSelectionItems:[],
            tableData: []
          });
          // this.loadModules(this.state.academicSessionId, value);
          // this.loadProgrammeCourses(this.state.academicSessionId, value);
        break;

        case "newAcademicSessionId":
          this.setState({
            newProgrammeGroupId: "",
            newProgrammeGroupsMenuItems: [],
          });
          this.loadNewProgrammeGroups(value);
        break;
        case "newProgrammeGroupId":
          this.setState({
            newProgrammeId: "",
          });
          // this.loadCourse(this.state.academicSessionId, value);
          // this.loadModules(this.state.academicSessionId, value);
            this.loadNewProgrammes(value);
        break; 
        case "newProgrammeId":
          this.setState({
            newProgrammeId: "",
            
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
    if(this.state.academicSessionId<20){
      if (!this.state.programmeGroupId) {
        this.setState({ programmeGroupIdError: "Please select programme group." });
        document.getElementById("programmeGroupId").focus();
        isValid = false;
      } else {
        this.setState({ programmeGroupIdError: "" });
      }
    }
  
    return isValid;
  };

  isProgrammeValid = () => {
    let isValid = true;
    if(this.state.academicSessionId<20){
      if (!this.state.programmeId) {
        this.setState({ programmeIdError: "Please select programme." });
        document.getElementById("programmeId").focus();
        isValid = false;
      } else {
        this.setState({ programmeIdError: "" });
      }
    }
    return isValid;
  };

  // isCourseValid = () => {
  //   let isValid = true;        
  //   if (!this.state.courseId) {
  //       this.setState({courseIdError:"Please select course."});
  //       document.getElementById("courseId");
  //       // .focus()
  //       isValid = false;
  //   } else {
  //       this.setState({courseIdError:""});
  //   }
  //   return isValid;
  // }

  
  handleGetData = () => {
    if(
      !this.isAcademicSessionValid()
      || !this.isProgrammeGroupValid()
      || !this.isProgrammeValid
      // || !this.isCourseValid()
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
        programmeGroupId: this.state.programmeGroupId, 
        studentNucleusId: data.studentNucleusId,
        studentName: data.studentName,
        academicSessionId: this.state.academicSessionId,
        courseIds: data.courseIds
      }
    });
    this.f212FormPopupOpen();
  }

  F221FormChangeStatusPopupOpen = () => {
    this.setState({F221FormChangeStatusPopupIsOpen: true});
  }

  F221FormChangeStatusPopupClose = () => {
    this.setState({F221FormChangeStatusPopupIsOpen: false});
  }

  F221FormChangeStatusPopupSetData = (data) => {
    this.setState({
      F221FormChangeStatusPopupData: {
        studentId: data.studentId,
        programmeGroupId: this.state.programmeGroupId, 
        studentNucleusId: data.studentNucleusId,
        studentName: data.studentName,
        applicationStatusId: data.applicationStatusId,
        renewalStatusId: data.renewalStatusId,
        examEntryStatusId: data.examEntryStatusId,
        courseCompletionStatusId: data.courseCompletionStatusId,
        endYearAchievementId: data.endYearAchievementId,
        pathwayId: data.pathwayId,
        uolNumber: data.uolNumber,
        candidateNo: data.candidateNo,
        courseIds: data.courseIds
      }
    });
    this.F221FormChangeStatusPopupOpen();
  }
  onFormSubmit = async () => {
    let data = new FormData();
    data.append("recordId", 0);
    data.append("academicsSessionId", this.state.newAcademicSessionId);
    data.append("programmeId", this.state.newProgrammeId);
    data.append("programmeGroupId", this.state.newProgrammeGroupId);
    data.append("pathwayId", this.state.pathway);
    var students=document.getElementsByName('recordId');
    var isPromoted=document.getElementsByName('promote');
    var isWithdrawn=document.getElementsByName('widthdrawn');
    
    for (var i=0, len = students.length; i<len; i++) {
      
      var isPromte=isPromoted[i].checked;
      var isWithdr=isWithdrawn[i].checked;
      if(isPromte==true || isWithdr==true){
        data.append("studentIds",students[i].value);
        if(isWithdr==true){
          // data.append("isWithdrawn", 1);
          data.append("isPromoted", 1);
        }else {
          // data.append("isWithdrawn", 0);
          data.append("isPromoted", 0);
        }
        if(isPromte==true){
          data.append("isWithDrawn", 1);
          // data.append("isPromoted", 1);
        }else {
          // data.append("isPromoted", 0);
          data.append("isWithDrawn", 0);
        }
        
      }

     
    }




    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C221CommonStudentsPromotionSave`;
    await fetch(url, {
        method: "POST",
        body: data,
        headers: new Headers({
            Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
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
                    this.handleOpenSnackbar(json.USER_MESSAGE, "success");
                      window.location.reload();
                } else {
                    this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
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
                    this.handleOpenSnackbar("Failed to Save ! Please try Again later.", "error");
                }
            });
    this.setState({ isLoading: false })
}

  onChangeStatusFormSubmit = async () => {

    if (
      !this.isAcademicSessionValid() 
      || !this.isProgrammeGroupValid()
      || !this.isProgrammeValid()
      // || !this.isCourseValid()
    ) { return; }

    let studentId = document.getElementById("studentId").value;
    let applicationStatusId = document.getElementById("applicationStatusId").value;
    let renewalStatusId = document.getElementById("renewalStatusId").value;
    let examEntryStatusId = document.getElementById("examEntryStatusId").value;
    let courseCompletionStatusId = document.getElementById("courseCompletionStatusId").value;
    let endYearAchievementId = document.getElementById("endYearAchievementId").value;
    let pathwayId = document.getElementById("pathwayId").value;
    let UOLNo = document.getElementById("UOLNo").value;
    let candidateNoEle = document.getElementById("candidateNo");
    let candidateNo = "";
    if(candidateNoEle){
      candidateNo = candidateNoEle.value;
    }
    let courseIds = document.getElementById("courseIds").value;
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
    
    let  courseCompletionStatusLabel = ""; 
    let ccsObj = this.state. courseCompletionStatusMenuItems.find( (obj) => obj.id ==  courseCompletionStatusId);
    if(ccsObj){
      courseCompletionStatusLabel = ccsObj.label;
    }
    let  endYearAchievementLabel = ""; 
    let eyaObj = this.state. endYearAchievementMenuItems.find( (obj) => obj.id ==  endYearAchievementId);
    if(eyaObj){
      endYearAchievementLabel = eyaObj.label;
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
    data.append("courseCompletionStatusId", courseCompletionStatusId);
    data.append("endYearAchievementId", endYearAchievementId);
    data.append("pathwayId", pathwayId);
    data.append("uolNumber", UOLNo);
    data.append("candidateNo", candidateNo);
    data.append("courseIds", courseIds);
    
    let tableData = [...this.state.tableData];
    
    let tableDataNewInstance = tableData.map((row, index) => { 
      
      let row10 = { ...row };
      
      if(row.id == studentId){
        
        row10.applicationStatusId = applicationStatusId;
        row10.applicationStatusLabel = applicationStatusLabel;
        row10.renewalStatusId = renewalStatusId;
        row10.renewalStatusLabel = renewalStatusLabel;
        row10.examEntryStatusId = examEntryStatusId;
        row10.examEntryStatusLabel = examEntryStatusLabel;
        row10.courseCompletionStatusId = courseCompletionStatusId;
        row10.courseCompletionStatusLabel = courseCompletionStatusLabel;
        row10.endYearAchievementId = endYearAchievementId;
        row10.endYearAchievementLabel = endYearAchievementLabel;
        row10.pathwayId = pathwayId;
        row10.pathwayLabel = pathwayLabel;
        row10.uolNumber = UOLNo;
        row10.candidateNo = candidateNo;

        let F221FormChangeStatusPopupData = {
          studentId: row.id,
          studentNucleusId: row.studentId,
          studentName: row.displayName,
          applicationStatusId: applicationStatusId,
          renewalStatusId: renewalStatusId,
          examEntryStatusId: examEntryStatusId,
          courseCompletionStatusId:  courseCompletionStatusId,
          endYearAchievementId:  endYearAchievementId,
          pathwayId: pathwayId,
          uolNumber: UOLNo,
          candidateNo: candidateNo,
          courseIds : courseIds
        };

        row10.changeStatusAction = (
          <IconButton
            color="primary"
            aria-label="Add"
            onClick={()=>this.F221FormChangeStatusPopupSetData(F221FormChangeStatusPopupData)}
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
            <Checkbox
             icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 30 }} />}
             checkedIcon={<CheckBoxIcon style={{ fontSize: 30 }} />}
             color="primary"
            //  onChange={(e) => this.onCheckClick(e, row)}
            //  checked={row.isChecked}
             inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
          </IconButton>
        );
      }
      return ( 
        row.id == studentId ? { ...row10 } : row 
      )
    }); // tableData.map ends
  
    this.setState({ 
      tableData: tableDataNewInstance,
      isLoading: true 
    });

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
            this.F221FormChangeStatusPopupClose();
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

    
    let academicSessionId = document.getElementById("academicSessionIdSA").value;
    let studentId = document.getElementById("studentId").value;
    let moduleNumber = document.getElementsByName("moduleNumber");
    let programmeCourseId = document.getElementsByName("programmeCourseId");
    let marks = document.getElementsByName("marks");
    let resetMarks = document.getElementsByName("resetMarks");

    let data = new FormData();
    data.append("id", 0);
    data.append("academicSessionId", academicSessionId);
    data.append("programmeId", this.state.programmeId);
    data.append("studentId", studentId);

    let recordLength = moduleNumber.length || 0;

    if (recordLength>0) {
      for (let i=0; i<recordLength; i++) {
        data.append("moduleNumber", moduleNumber[i].value);
        data.append("programmeCourseId", programmeCourseId[i].value);
        data.append("marks", marks[i].value);
        data.append("resetMarks", resetMarks[i].value);
      }
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
            this.f212FormPopupClose();
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
                Student Promotion
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
                      style={{padding:5,marginTop:10}}
                      onClick={this.handleToggleTableFilter} 
                      
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
                  <Grid item xs={12} md={3}>
                    <TextField
                      id="academicSessionId"
                      name="academicSessionId"
                      variant="outlined"
                      label="Existing Academic Session"
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
                  <Grid item xs={12} md={4}>
                    <TextField
                      id="programmeId"
                      name="programmeId"
                      variant="outlined"
                      label="Programme"
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
                   
                  </Grid>
                 
                  
                  <Grid item xs={12} md={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={this.state.isLoading || (!this.state.programmeGroupId && this.state.academicSessionId<20)}
                      onClick={() => this.handleGetData()}
                      style={{width:"100%", height:54, marginBottom:24}}
                    > 
                      {this.state.isLoading ? <CircularProgress style={{color:'white'}} size={36}/> : "Search"}
                    </Button>
                  </Grid>
                </Grid>
              </Collapse>
              <Divider
                style={{
                  backgroundColor: "rgb(58, 127, 187)",
                  opacity: "0.3",
                }}
              />
              <br/>
            </Grid>

            <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      id="newAcademicSessionId"
                      name="newAcademicSessionId"
                      variant="outlined"
                      label="New Academic Session"
                      onChange={this.onHandleChange}
                      value={this.state.newAcademicSessionId}
                      error={!!this.state.newAcademicSessionIdError}
                      helperText={this.state.newAcademicSessionIdError}
                      required
                      fullWidth
                      select
                    >
                      {this.state.newAcademicSessionMenuItems.map((dt, i) => (
                        <MenuItem
                          key={"newAcademicSessionMenuItems"+dt.ID}
                          value={dt.ID}
                        >
                          {dt.Label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      id="newProgrammeGroupId"
                      name="newProgrammeGroupId"
                      variant="outlined"
                      label="New Program Group"
                      fullWidth
                      select
                      required
                      onChange={this.onHandleChange}
                      value={this.state.newProgrammeGroupId}
                      error={!!this.state.newProgrammeGroupIdError}
                      helperText={this.state.newProgrammeGroupIdError}
                      disabled={!this.state.newAcademicSessionId}
                    >
                      {this.state.newProgrammeGroupsMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"newProgrammeGroupsMenuItems"+dt.Id}
                            value={dt.Id}
                          >
                            {dt.Label}
                          </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      id="newProgrammeId"
                      name="newProgrammeId"
                      variant="outlined"
                      label="New Programme"
                      onChange={this.onHandleChange}
                      value={this.state.newProgrammeId}
                      error={!!this.state.newProgrammeIdError}
                      helperText={this.state.newProgrammeIdError}
                      fullWidth
                      select
                    >
                      {this.state.newProgrammeMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"newProgrammeMenuItems"+dt.ID}
                            value={dt.ID}
                          >
                            {dt.Label}
                          </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}
                  style={{marginBottom:20}}
                  >
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
                </Grid>
                <Divider style={{
                        opacity: '0.8',
                        width: '98%',
                        marginTop: 15,
                        marginBottom: 15
                    }}
                    />
                    <div style={{
                        display: 'flex',
                        width: '98%',
                        marginLeft: "61%"
                    }}>
                                <FormControlLabel
                                      control={
                                        <Switch
                                          checked={this.state.isPromoteAll}
                                          value={this.state.isPromoteAll}
                                          name="isPromoteAll"
                                          color="primary"
                                          onChange={(e) => this.handlePromoteAll(e)}
                                        />
                                      }
                                      label="Promote All"
                                    />
                                <FormControlLabel
                                      control={
                                        <Switch
                                          // checked={state.checkedB}
                                          checked={this.state.isWithdrawnAll}
                                          value={this.state.isWithdrawnAll}
                                          name="checkedB"
                                          color="primary"
                                          onChange={(e) => this.handleWithdrawnAll(e, indexedDB)}
                                        />
                                      }
                                      label="Withdrawn All"
                                      style={{
                                        marginLeft: "6%"
                                      }}
                                    />
                        <Button color="primary" 
                            style={{
                                marginRight: 10,
                                textTransform: 'capitalize'
                            }} variant="outlined" onClick={() => this.onAllClick()}>
                            Clear Selection
                                </Button>

                    </div>
            
            <Grid item xs={12}>
              <F221FormTableComponent
                rows={this.state.tableData}
                showFilter={this.state.showTableFilter}
              />
            </Grid>
          </Grid>
          <BottomBar
                    left_button_text="View"
                    left_button_hide={true}
                    bottomLeftButtonAction={() => this.viewReport()}
                    right_button_text="Promote"
                    bottomRightButtonAction={() => this.onFormSubmit()}
                    disableRightButton={!this.state.pathway}
                    loading={this.state.isLoading}
                    isDrawerOpen={this.props.isDrawerOpen}
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

export default  withStyles(styles)(F221Form);
