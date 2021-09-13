import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import {
  TextField,
  Grid,
  CircularProgress,
  Typography,
  MenuItem,
  Divider,
  Checkbox,
  Chip,
  Hidden,
  FormControlLabel,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const styles = () => ({
  root: {
    padding: 20,
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

function CourseRow(props) {
  const { rowIndex, rowData, programmeCoursesArray, ...rest } = props;

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [isChecked, setIsChecked] = useState(props.isChecked);

  const handleChecked = () => {
    if (!rowData.isOffered) {
      rowData.isOffered = true;
    } else {
      rowData.isOffered = false;
    }
    setIsChecked(!isChecked);
  };
  console.log(rowData.coursePrerequisitesList);
  return (
    <Fragment>
      <Grid item xs={12}></Grid>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12} md={4}>
          <Typography
            color="normal"
            variant="subtitle1"
            component="div"
            style={{ float: "left" }}
          >
            {rowData.courseTitle}
          </Typography>

          <TextField
            type="hidden"
            name="programmeCourseId"
            value={rowData.ID}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography
            color="normal"
            variant="subtitle1"
            component="div"
            style={{ float: "left" }}
          >
            {rowData.coursePrerequisitesList.map((data, index) => (
              <Fragment key={"pcpr" + index}>
                {data.Label}
                <br />
              </Fragment>
            ))}
          </Typography>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rowData.isOffered}
                onChange={handleChecked}
                name="isOfferedCheckbox"
                color="primary"
                value={isChecked}
              />
            }
            label=""
            style={{
              color: "#1d5f98",
              fontWeight: 600,
              marginBottom: 5,
              fontSize: 12,
              wordBreak: "break-word",
            }}
          />
          <TextField type="hidden" name="isOffered" value={rowData.isOffered} />
        </Grid>
      </Grid>
    </Fragment>
  );
}

class F27Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      academicsSessionIdMenuItems: [],
      academicsSessionId: "",
      academicsSessionIdError: "",
      programmeGroupMenuItems: null,
      programmeGroupId: "",
      programmeGroupIdError: "",
      programmeGroupCoursesArray: null,
      prerequisiteCourseArray: [],
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
  loadAcademicSession = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C27CommonAcademicSessionsView`;
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
            this.setState({ academicsSessionIdMenuItems: json.DATA });
            for (
              var i = 0;
              i < this.state.academicsSessionIdMenuItems.length;
              i++
            ) {
              if (this.state.academicsSessionIdMenuItems[i].isActive == "1") {
                this.state.academicsSessionId = this.state.academicsSessionIdMenuItems[
                  i
                ].ID;
                this.loadProgrammeGroups(this.state.academicsSessionId);
              }
            }
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
              "Failed to fetch ! Please try again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };
  loadProgrammeGroups = async (AcademicsSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", AcademicsSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C27CommonAcademicsSessionsOfferedProgrammesView`;
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
            this.setState({ programmeGroupMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("programmeGroupMenuItems", json);
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
              "Failed to fetch ! Please try again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadProgrammeGroupCourses = async (ProgrammeGroupId) => {
    let data = new FormData();
    data.append("sessionId", this.state.academicsSessionId);
    data.append("programmeGroupId", ProgrammeGroupId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C27CommonProgrammeCoursesView`;
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
            this.setState({
              programmeGroupCoursesArray: json.DATA,
              programmeCoursesArray: json.DATA,
            });
            let prerequisiteCourseArray = [];
            for (let i = 0; i < json.DATA.length; i++) {
              let obj = {
                ID: json.DATA[i].ID,
                Label: json.DATA[i].courseLabel,
              };
              prerequisiteCourseArray.push(obj);
            }
            this.setState({
              programmeCoursesListArray: prerequisiteCourseArray,
            });
            console.log("programmeCoursesListArray", prerequisiteCourseArray);
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("loadProgrammeGroupCourses", json);
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
              "Failed to fetch ! Please try again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadData = async (index) => {
    const data = new FormData();
    data.append("id", index);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C27CommonAcademicsSessionsOfferedCoursesOfferedFlagView`;
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
            this.setState({
              label: json.DATA[0].label,
              shortLabel: json.DATA[0].shortLabel,
            });
          } else {
            //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
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
            // alert("Failed to Save ! Please try Again later.");
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };
  isAcademicSessionValid = () => {
    let isValid = true;
    if (!this.state.academicsSessionId) {
      this.setState({
        academicsSessionIdError: "Please select Academic Session.",
      });
      document.getElementById("academicsSessionId").focus();
      isValid = false;
    } else {
      this.setState({ academicsSessionIdError: "" });
    }
    return isValid;
  };
  isProgrammeGroupValid = () => {
    let isValid = true;
    if (!this.state.programmeGroupId) {
      this.setState({
        programmeGroupIdError: "Please select programme group.",
      });
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

    this.setState({
      [name]: value,
      [errName]: "",
    });
    console.log("value===========>", { name, value });
    switch (name) {
      case "academicsSessionId":
        this.loadProgrammeGroups(value);
        break;
      case "programmeGroupId":
        this.loadProgrammeGroupCourses(value);
        break;

      default:
        break;
    }
  };

  clickOnFormSubmit = () => {
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    if (!this.isAcademicSessionValid() || !this.isProgrammeGroupValid()) {
      return;
    }
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C27CommonAcademicsSessionsOfferedCoursesSave`;
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
              window.location.reload();
            }, 1500);
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

  viewReport = () => {
    window.location = "#/dashboard/F27Reports";
  };

  componentDidMount() {
    this.loadAcademicSession();
    //this.loadProgrammeGroups();
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.loadData(nextProps.match.params.recordId);
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
          <TextField
            type="hidden"
            name="recordId"
            value={this.state.recordId}
          />
          <Grid container component="main" className={classes.root}>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
                width: "98%",
                marginBottom: 25,
                fontSize: 20,
              }}
              variant="h5"
            >
              Course Offering
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
                  id="academicsSessionId"
                  name="academicsSessionId"
                  variant="outlined"
                  label="Academic Session"
                  onChange={this.onHandleChange}
                  value={this.state.academicsSessionId}
                  error={!!this.state.academicsSessionIdError}
                  helperText={this.state.academicsSessionIdError}
                  required
                  fullWidth
                  select
                >
                  {this.state.academicsSessionIdMenuItems ? (
                    this.state.academicsSessionIdMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"academicsSessionIdMenuItems" + dt.ID}
                        value={dt.ID}
                      >
                        {dt.Label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>
                      <CircularProgress />
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="programmeGroupId"
                  name="programmeGroupId"
                  variant="outlined"
                  label="Programme Group"
                  onChange={this.onHandleChange}
                  value={this.state.programmeGroupId}
                  error={!!this.state.programmeGroupIdError}
                  helperText={this.state.programmeGroupIdError}
                  required
                  fullWidth
                  select
                >
                  {this.state.programmeGroupMenuItems ? (
                    this.state.programmeGroupMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"programmeGroupMenuItems" + dt.Id}
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
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} md={4}>
                  <Typography
                    color="primary"
                    variant="subtitle1"
                    component="div"
                    style={{ float: "left" }}
                  >
                    <b>Course Label</b>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    color="primary"
                    variant="subtitle1"
                    component="div"
                    style={{ float: "left" }}
                  >
                    <b>Prerequisite Courses</b>
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography
                    color="primary"
                    variant="subtitle1"
                    component="div"
                    style={{ float: "left" }}
                  >
                    <b>Offered</b>
                  </Typography>
                </Grid>
              </Grid>
              {this.state.programmeGroupCoursesArray ? (
                this.state.programmeGroupCoursesArray.map((dt, i) => (
                  <CourseRow
                    key={"programmeGroupCoursesArray" + i}
                    rowIndex={++i}
                    rowData={dt}
                    programmeCoursesArray={this.state.programmeCoursesArray}
                  />
                ))
              ) : this.state.isLoading ? (
                <Grid
                  container
                  justify="center"
                  alignContent="center"
                  style={{ padding: "1em" }}
                >
                  <CircularProgress />
                </Grid>
              ) : (
                ""
              )}
            </Grid>
            <br />
            <br />
            <br />
          </Grid>
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={true}
          bottomLeftButtonAction={this.viewReport}
          right_button_text="Save"
          bottomRightButtonAction={this.clickOnFormSubmit}
          loading={this.state.isLoading}
          isDrawerOpen={this.props.isDrawerOpen}
        />
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
export default withStyles(styles)(F27Form);
