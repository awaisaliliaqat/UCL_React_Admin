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
import F75FormPopupComponent from "./F75FormPopupComponent";
import F75FormTableComponent from "./F75FormTableComponent";
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

class F75Form extends Component {
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
      f75FormPopupIsOpen: false,
      f75FormPopupData: {
        studentId: "", 
        studentNucleusId: "", 
        studentName: ""
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

  loadData = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C75GuardianRegisterationApprovalView`;
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
            let data = json.DATA || [];
            let dataLength = data.length || 0;

            for (let i=0; i<dataLength; i++) {

              let f75FormPopupData = {
                studentId: data[i].id,
                studentNucleusId: data[i].studentId,
                studentName: data[i].displayName
              };

              data[i].action = (
                <IconButton
                  color="primary"
                  aria-label="Add"
                  onClick={()=>this.f75FormPopupSetData(f75FormPopupData)}
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
        break;
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };
    
  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  f75FormPopupOpen = () => {
    this.setState({f75FormPopupIsOpen: true});
  }

  f75FormPopupClose = () => {
    this.setState({f75FormPopupIsOpen: false});
  }

  f75FormPopupSetData = (data) => {
    this.setState({
      f75FormPopupData: {
        studentId: data.studentId, 
        studentNucleusId: data.studentNucleusId,
        studentName: data.studentName,
        academicSessionId: this.state.academicSessionId
      }
    });
    this.f75FormPopupOpen();
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
        row10.pathwayId = pathwayId;
        row10.pathwayLabel = pathwayLabel;
        row10.uolNumber = UOLNo;

        let f75FormChangeStatusPopupData = {
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
            onClick={()=>this.f75FormChangeStatusPopupSetData(f75FormChangeStatusPopupData)}
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
            this.f75FormChangeStatusPopupClose();
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
            this.f75FormPopupClose();
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
    this.loadData();
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
            <F75FormPopupComponent
              isOpen={this.state.f75FormPopupIsOpen}
              data={this.state.f75FormPopupData}
              academicSessionMenuItems={this.state.academicSessionMenuItems}
              preModuleMenuItems={this.state.preModuleMenuItems}
              preCourseMenuItems={this.state.preCourseMenuItems}
              isLoading={this.state.isLoading}
              onFormSubmit ={() => this.onStudentAchievementFormSubmit}
              handleOpenSnackbar={this.handleOpenSnackbar}
              f75FormPopupClose={this.f75FormPopupClose}
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
                Guardian Registeration Approval
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
              <F75FormTableComponent
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

export default  withStyles(styles)(F75Form);
