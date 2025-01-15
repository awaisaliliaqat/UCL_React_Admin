import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles, useTheme } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import {
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Divider,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import FilterIcon from "mdi-material-ui/FilterOutline";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import F30FormFilter from "./F30FormFilter";
import F30FormTableComponent from "./F30FormTableComponent";
import F30FormPopupComponent from "./F30FormPopupComponent";

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
});

class F30Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      academicSessionIdMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      programmeIdMenuItems: [],
      programmeId: "",
      programmeIdError: "",
      preModuleMenuItems: [],
      preCourseMenuItems: [],
      programmeCoursesArray: [],
      programmeCoursesListArray: [],
      programmeCoursesArraySelected: null,
      courseRowDataArray: [],
      showTableFilter: false,
      studentListArray: [],
      totalStudents: []
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
    this.setState({
      isOpenSnackbar: false,
    });
  };

  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  handleToggleSearchBar = () => {
    this.setState({ showSearchBar: !this.state.showSearchBar });
  };

  loadAcademicSession = async (sessionId, programmeId) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C30CommonAcademicSessionsView`;
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
        async (json) => {
          if (json.CODE === 1) {

            let data = json.DATA || [];
            
            let res2 = data.find((obj) => obj.ID == sessionId);
            if (sessionId && res2) {
              this.setState({
                academicSessionId: res2.ID,
              });
              await this.loadProgrammes(res2.ID, programmeId);
            } else {
              let res = data.find((obj) => obj.isActive === 1);
              if (res) {
                this.setState({
                  academicSessionId: res.ID,
                });
                this.loadProgrammes(res.ID);
              }
            }

            this.setState({ academicSessionIdMenuItems: data });
           
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadProgrammes = async (academicsSessionId, programmeId) => {
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C30CommonProgrammesView`;
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
            this.setState({ programmeIdMenuItems: json.DATA || [], programmeId: programmeId || "" });
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("loadProgrammes", json);
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

  loadProgrammeCourses = async (academicsSessionId, programmeId) => {
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeId", programmeId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C30CommonProgrammeCoursesView`;
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
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadStudents = async (programmeId,studentId) => {
    let data = new FormData();
    data.append("programmeId", programmeId);
    data.append("studentId", studentId || 0);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C30CommonStudentsView`;
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
            for (var i = 0; i < json.DATA[0].students.length; i++) {
              json.DATA[0].students[i].action = (
                <F30FormPopupComponent
                  academicSessionId={this.state.academicSessionId}
                  dialogTitle={json.DATA[0].students[i].nucleusId+" - "+json.DATA[0].students[i].studentName+" - "+json.DATA[0].students[i].programmeLabel}
                  studentId={json.DATA[0].students[i].ID}
                  preModuleMenuItems={this.state.preModuleMenuItems}
                  preCourseMenuItems={this.state.preCourseMenuItems}
                  clickOnFormSubmit={() => this.clickOnFormSubmit}
                  handleOpenSnackbar={this.handleOpenSnackbar}
                />
              );
            }
            this.setState({ studentListArray: json.DATA[0].students || [] });
            let totalStudents = this.state.studentListArray.length;
            this.setState({totalStudents: totalStudents});
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("loadStudents", json);
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

  isProgrammeValid = () => {
    let isValid = true;
    if (!this.state.programmeId) {
      this.setState({ programmeIdError: "Please select Programme." });
      document.getElementById("programmeId").focus();
      isValid = false;
    } else {
      this.setState({ programmeIdError: "" });
    }
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    switch (name) {
      case "academicSessionId":
        this.setState({
          programmeId: "",
          studentListArray: [],
          courseRowDataArray: [],
          preCourseMenuItems: [],
          preModuleMenuItems: [],
        });
        this.loadProgrammes(value);
        break;
      case "programmeId":
        this.setState({
          studentListArray: [],
          courseRowDataArray: [],
          preCourseMenuItems: [],
          preModuleMenuItems: [],
        });
        this.loadProgrammeCourses(this.state.academicSessionId, value);
        this.loadModules(this.state.academicSessionId, value);
        this.loadStudents(value);
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
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
    this.onLoadAllData();
  }

  onLoadAllData = async () => {

    const query = new URLSearchParams(this.props.location.search);
    const studentId = query.get("studentId") || "";
    const academicSessionId = query.get("academicSessionId") || "";
    const programmeId = query.get("programmeId") || "";

    await this.loadAcademicSession(academicSessionId, programmeId);
    if(studentId != ""){
      this.loadStudents(programmeId, studentId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
      } else {
        window.location.reload();
      }
    }
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
        <form id="myForm" onSubmit={this.isFormValid}>
          <TextField type="hidden" name="id" value={this.state.recordId} />
          <Grid container component="main" className={classes.root}>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid #d2d2d2",
                width: "98%",
                marginBottom: 25,
                fontSize: 20,
              }}
              variant="h5"
            >
              Student Achievement
              {/* 
              <div style={{ float: "right" }}>
                <Tooltip title="Table Filter">
                  <IconButton
                    style={{ marginLeft: "-10px" }}
                    onClick={this.handleToggleTableFilter}
                  >
                    <FilterIcon fontSize="default" color="primary" />
                  </IconButton>
                </Tooltip>
              </div> 
              */}
            </Typography>
            <Divider
              style={{
                backgroundColor: "rgb(58, 127, 187)",
                opacity: "0.3",
              }}
            />
            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
              }}
            >
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <TextField
                  id="programmeId"
                  name="programmeId"
                  variant="outlined"
                  label="Programme"
                  value={this.state.programmeId}
                  onChange={this.onHandleChange}
                  error={!!this.state.programmeIdError}
                  helperText={this.state.programmeIdError}
                  disabled={!this.state.academicSessionId}
                  required
                  fullWidth
                  select
                >
                  {this.state.programmeIdMenuItems ? (
                    this.state.programmeIdMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"programmeIdMenuItems" + dt.ID}
                        value={dt.ID}
                      >
                        {dt.Label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>
                      <CircularProgress size={24} />
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12}>
              {this.state.totalStudents>1? 
                         <Typography
                           style={{
                              color: "#1d5f98",
                              fontWeight: 600,
                              textTransform: "capitalize",
                              textAlign: "left"
                                  }}
                              variant="subtitle1"
                          >
                              Total Students: {this.state.totalStudents}
                          </Typography>
                          :
                          ""
                          }
                <Divider
                  style={{
                    backgroundColor: "rgb(58, 127, 187)",
                    opacity: "0.3",
                  }}
                />
              </Grid>
              {/* 
              {this.state.showSearchBar ? (
                <F30FormFilter
                    isLoading={this.state.isLoading}
                    handleDateChange={this.handleDateChange}
                    onClearFilters={this.onClearFilters}
                    values={this.state}
                    getDataByStatus={(status) => this.getData(status)}
                    onHandleChange={(e) => this.onHandleChange(e)}
                />
              ) : (
                <br />
              )} 
              */}
              {this.state.studentListArray.length > 0 ? (
                <F30FormTableComponent
                  rows={this.state.studentListArray}
                  showFilter={this.state.showTableFilter}
                />
              ) : this.state.isLoading ? (
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  style={{ paddingTop: "2em" }}
                >
                  <CircularProgress />
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </form>
        {/* 
        <BottomBar
          leftButtonText="View"
          leftButtonHide={true}
          bottomLeftButtonAction={this.viewReport}
          right_button_text="Save"
          bottomRightButtonAction={this.clickOnFormSubmit}
          loading={this.state.isLoading}
          isDrawerOpen={ this.props.isDrawerOpen }
        /> 
        */}
        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleCloseSnackbar()}
        />
      </Fragment>
    );
  }
}
export default withStyles(styles)(F30Form);
