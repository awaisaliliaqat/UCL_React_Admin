import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import {TextField, Grid, MenuItem, CircularProgress, Divider, Typography,
  IconButton, Tooltip, Fab} from "@material-ui/core";
import FilterIcon from "mdi-material-ui/FilterOutline";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import F31FormFilter from "./F31FormFilter";
import F31FormTableComponent from "./F31FormTableComponent";
import F31FormPopupComponent from "./F31FormPopupComponent";
import AddIcon from "@material-ui/icons/Add";
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';

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

class F31Form extends Component {
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
      programmeGroupIdMenuItems: [],
      programmeGroupId: "",
      programmeGroupIdError: "",
      preDaysMenuItems: [], //["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      preTimeStartMenuItems: [],
      showTableFilter: false,
      CourseListArray: [],
      roomsData: [],
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
      if (times[i] == "08:00 PM") {
        break;
      }
    }
    console.log(times);
    this.setState({ preTimeStartMenuItems: times });
  };

  loadAcademicSession = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C31CommonAcademicSessionsView`;
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

  getRoomsData = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C51CommonAcademicsScheduleClassRoomsView`;
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
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.", "error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getRoomsData = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C31CommonAcademicsScheduleClassRoomsView`;
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
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

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
  loadDaysOfWeek = async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C31CommonDaysOfWeekView`;
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
            this.setState({ preDaysMenuItems: json.DATA });
          } else {

            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");

          }
          console.log("loadDaysOfWeek", json);
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
  };
  loadCourses = async (academicsSessionId, programmeGroupId) => {
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeGroupId", programmeGroupId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C31CommonAcademicSectionsBySessionIdAndProgrammeGroupId`;
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
            for (var i = 0; i < json.DATA.length; i++) {
              let teacherName = json.DATA[i].teacherName;
              let activeDate = json.DATA[i].activeDate;
              json.DATA[i].action = (
                teacherName ?
                <Fragment>
                  {activeDate ?
                    <F31FormPopupComponent
                      sectionId={json.DATA[i].ID}
                      preTimeStartMenuItems={this.state.preTimeStartMenuItems}
                      preDaysMenuItems={this.state.preDaysMenuItems}
                      clickOnFormSubmit={this.clickOnFormSubmit}
                      courseLabel={json.DATA[i].courseLabel}
                      sectionTypeLabel={json.DATA[i].sectionTypeLabel}
                      sectionLabel={json.DATA[i].sectionLabel}
                      teacherName={json.DATA[i].teacherName}
                      teacherId={json.DATA[i].teacherId}
                      activeDate={json.DATA[i].activeDate}
                      activeDateInNumber={json.DATA[i].activeDateInNumber}
                      handleOpenSnackbar={this.handleOpenSnackbar}
                      values={this.state}
                      onAutoCompleteChange={this.onAutoCompleteChange}
                      isReadOnly={true}
                      effectiveDatesArray={json.DATA[i].effectiveDatesArray || []}
                      isLoading={this.state.isLoading}
                    />
                  :
                  <Fragment>
                    <span>&emsp;</span>
                    <Fab 
                      size="small"
                      disabled={true}
                    >
                      <VisibilityOutlinedIcon />
                    </Fab>
                    <span>&emsp;</span>
                  </Fragment>
                  }
                  <F31FormPopupComponent
                    sectionId={json.DATA[i].ID}
                    preTimeStartMenuItems={this.state.preTimeStartMenuItems}
                    preDaysMenuItems={this.state.preDaysMenuItems}
                    clickOnFormSubmit={this.clickOnFormSubmit}
                    courseLabel={json.DATA[i].courseLabel}
                    sectionTypeLabel={json.DATA[i].sectionTypeLabel}
                    sectionLabel={json.DATA[i].sectionLabel}
                    teacherName={json.DATA[i].teacherName}
                    teacherId={json.DATA[i].teacherId}
                    activeDate={json.DATA[i].activeDate}
                    activeDateInNumber={json.DATA[i].activeDateInNumber}
                    handleOpenSnackbar={this.handleOpenSnackbar}
                    values={this.state}
                    onAutoCompleteChange={this.onAutoCompleteChange}
                    isReadOnly={false}
                    effectiveDatesArray={json.DATA[i].effectiveDatesArray || []}
                    isLoading={this.state.isLoading}
                  />
                </Fragment>
                :
                <Fragment>
                  <Fab 
                    size="small"
                    disabled={true}
                  >
                    <VisibilityOutlinedIcon />
                  </Fab>
                  <span>&emsp;&nbsp;&nbsp;&nbsp;</span>
                  <Fab 
                    size="small"
                    disabled={true}
                  >
                    <AddIcon />
                  </Fab>
                </Fragment>

              );
            }
            this.setState({ CourseListArray: json.DATA || [], });
          } else {

            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");

          }
          console.log("loadCourses", json);
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
    if (!this.state.programmeGroupId) {
      this.setState({ programmeGroupIdError: "Please select Programme." });
      document.getElementById("programmeGroupId").focus();
      isValid = false;
    } else {
      this.setState({ programmeGroupIdError: "" });
    }
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    switch (name) {
      case "academicSessionId":
        this.setState({
          programmeGroupId: "",
          CourseListArray: [],
        });
        this.loadProgrammeGroups(value);
        break;
      case "programmeGroupId":
        this.setState({
          CourseListArray: [],
          courseRowDataArray: [],
        });
        this.loadCourses(this.state.academicSessionId, value);
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

    let teacherId = document.getElementById("teacherId").value
    let effectiveDate = document.getElementById("effectiveDate").value;
    let sectionId = document.getElementById("sectionId").value;
    let dayId = document.getElementsByName("dayId");
    let startTime = document.getElementsByName("startTime");
    let duration = document.getElementsByName("duration");
    let roomDBIds = document.getElementsByName("roomDBId");

    let myForm = document.getElementById("myForm");
    let data = new FormData(myForm);

    data.append("teacherId", teacherId)
    data.append("effectiveDate", effectiveDate);
    data.append("sectionId", sectionId);
    if (dayId != null) {
      for (let i = 0; i < dayId.length; i++) {
        data.append("dayId", dayId[i].value);
        data.append("startTime", startTime[i].value);
        data.append("duration", duration[i].value);
        data.append("classRoomId", roomDBIds[i].value);
      }
    }

    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C31CommonAcademicsScheduleSave`;
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
              // if (this.state.recordId != 0) {
              //   window.location = "#/dashboard/F09Reports";
              // } else {
                window.location.reload();
              // }
            }, 2000);
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
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
    this.loadAcademicSession();
    this.getPreTimeSlotsMenuItems();
    this.loadDaysOfWeek();
    this.getRoomsData();
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
          <Grid 
            container 
            component="main" 
            className={classes.root}
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
            >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
                width: "98%",
                marginBottom: 18,
                fontSize: 20,
              }}
              variant="h5"
            >
              <span style={{ float: "right", marginBottom: -8 }}>
                <Tooltip title="Table Filter">
                  <IconButton
                    onClick={this.handleToggleTableFilter}
                  >
                    <FilterIcon fontSize="default" color="primary" />
                  </IconButton>
                </Tooltip>
              </span>
              Define Timetable
            </Typography>
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
                  id="programmeGroupId"
                  name="programmeGroupId"
                  variant="outlined"
                  label="Programme Group"
                  value={this.state.programmeGroupId}
                  onChange={this.onHandleChange}
                  error={!!this.state.programmeGroupIdError}
                  helperText={this.state.programmeGroupIdError}
                  disabled={!this.state.academicSessionId}
                  required
                  fullWidth
                  select
                >
                  {this.state.programmeGroupIdMenuItems ? (
                    this.state.programmeGroupIdMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"programmeGroupIdMenuItems" + dt.Id}
                        value={dt.Id}
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
                <Divider
                  style={{
                    backgroundColor: "rgb(58, 127, 187)",
                    opacity: "0.3",
                  }}
                />
              </Grid>
              {this.state.showSearchBar ? 
                <F31FormFilter
                  isLoading={this.state.isLoading}
                  handleDateChange={this.handleDateChange}
                  onClearFilters={this.onClearFilters}
                  values={this.state}
                  getDataByStatus={(status) => this.getData(status)}
                  onHandleChange={(e) => this.onHandleChange(e)}
                />

              : 
                <br />
              }
              {this.state.CourseListArray.length > 0 ? 

                <F31FormTableComponent
                  rows={this.state.CourseListArray}
                  showFilter={this.state.showTableFilter}
                />
               : this.state.isLoading ?
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  style={{ paddingTop: "2em" }}
                >
                  <CircularProgress />
                </Grid>

                : 
                ""
              }

            </Grid>
          </Grid>
        </form>
        {/* <BottomBar
                    left_button_text="View"
                    left_button_hide={true}
                    bottomLeftButtonAction={this.viewReport}
                    right_button_text="Save"
                    bottomRightButtonAction={this.clickOnFormSubmit}
                    loading={this.state.isLoading}
                    isDrawerOpen={ this.props.isDrawerOpen }
                /> */}
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
export default withStyles(styles)(F31Form);
