import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import {
  TextField,
  Grid,
  MenuItem,
  Divider,
  Typography,
  CircularProgress,
  Chip,
  Button,
} from "@material-ui/core";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import HistoryIcon from "@material-ui/icons/History";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { IsEmpty } from "../../../../../utils/helper";

const styles = () => ({
  root: {
    padding: 20,
    minWidth: 350,
    overFlowX: "auto",
  },
  pageTitle: {
    color: "#1d5f98",
    fontWeight: 600,
    borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
    width: "100%",
    marginTop: -10,
    marginBottom: 24,
    fontSize: "1.5rem",
  },
  dividerStyle: {
    backgroundColor: "rgb(58, 127, 187)",
    opacity: "0.3",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  button: {
    textTransform: "capitalize",
    fontSize: 14,
    height: 45,
  },
});

class R317TeacherCoursesHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isReload: false,

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      academicSessionsData: [],
      academicSessionsDataLoading: false,
      academicSessionId: "",
      academicSessionIdError: "",

      teachersData: [],
      teachersDataLoading: false,
      teacherObject: {},
      teacherObjectError: "",

      teacherSectionsData: [],
    };
  }

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  getAcademicSessions = async () => {
    this.setState({ academicSessionsDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C317CommonAcademicSessionsView`;
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
            this.setState({ academicSessionsData: array });
            let arrayLength = array.length;
            for (let i = 0; i < arrayLength; i++) {
              if (array[i].isActive == "1") {
                this.setState({ academicSessionId: array[i].ID });
              }
            }
          } else {
            this.handleSnackbar(
              true,
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
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
            this.handleSnackbar(
              true,
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ academicSessionsDataLoading: false });
  };

  getAllTeachersData = async () => {
    this.setState({ teachersDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C317CommonUsersView`;
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
            this.setState({ teachersData: array });
          } else {
            this.handleSnackbar(
              true,
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
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
            this.handleSnackbar(
              true,
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ teachersDataLoading: false });
  };

  onSearchClick = async (e) => {
    if (!IsEmpty(e)) {
      e.preventDefault();
    }
    this.setState({ isLoading: true, teacherSectionsData: [] });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/common/C317CommonAcademicsSectionsTeachersHistoryView?sessionId=${
      this.state.academicSessionId || 0
    }&teacherId=${this.state.teacherObject?.id || 0}`;
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
            this.setState({ teacherSectionsData: array });
          } else {
            this.handleSnackbar(
              true,
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
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
            this.handleSnackbar(
              true,
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  onClearClick = () => {
    let sessionId = "";

    let array = this.state.academicSessionsData || [];
    let arrayLength = array.length;
    for (let i = 0; i < arrayLength; i++) {
      if (array[i].isActive == "1") {
        sessionId = array[i].ID || "";
      }
    }

    this.setState({
      teacherObject: {},
      teacherObjectError: "",
      academicSessionIdError: "",
      academicSessionId: sessionId,

      teacherSectionsData: [],
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;

    switch (name) {
      case "academicSessionId":
      case "teacherObject":
        this.setState({
          teacherSectionsData: [],
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

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getAcademicSessions();
    this.getAllTeachersData();
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
        <Grid container component="main" className={classes.root}>
          <Typography className={classes.pageTitle}>
            Teacher Courses History
          </Typography>
          <Divider className={classes.dividerStyle} />
          <Grid container spacing={2}>
            <Grid item xs={4}>
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
                {this.state.academicSessionsData.map((dt) => (
                  <MenuItem key={dt} value={dt.ID}>
                    {dt.Label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                id="teacherObject"
                getOptionLabel={(option) =>
                  typeof option.label == "string" ? option.label : ""
                }
                getOptionSelected={(option, value) => option.id === value.id}
                fullWidth
                aria-autocomplete="none"
                options={this.state.teachersData}
                loading={this.state.teachersDataLoading}
                value={this.state.teacherObject}
                onChange={(e, value) =>
                  this.onHandleChange({
                    target: { name: "teacherObject", value },
                  })
                }
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      key={option}
                      label={option.label}
                      color="primary"
                      variant="outlined"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => {
                  const inputProps = params.inputProps;
                  return (
                    <TextField
                      variant="outlined"
                      error={!!this.state.teacherObjectError}
                      helperText={this.state.teacherObjectError}
                      inputProps={inputProps}
                      label="Teacher"
                      {...params}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <div className={classes.actions}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={
                    this.state.isLoading ||
                    !this.state.academicSessionId ||
                    IsEmpty(this.state.teacherObject)
                  }
                  onClick={(e) => this.onSearchClick(e)}
                  size="medium"
                >
                  {" "}
                  {this.state.isLoading ? (
                    <CircularProgress style={{ color: "white" }} size={24} />
                  ) : (
                    "Search"
                  )}
                </Button>
                <Button
                  variant="contained"
                  color="default"
                  className={classes.button}
                  size="medium"
                  style={{
                    marginLeft: 15,
                  }}
                  onClick={() => this.onClearClick()}
                  disabled={this.state.isLoading}
                >
                  Clear
                </Button>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.dividerStyle} />
            </Grid>
            <Grid item xs={12}>
              {!this.state.isLoading ? (
                <Fragment>
                  {this.state.teacherSectionsData.length > 0 ? (
                    <Fragment>
                      {this.state.teacherSectionsData?.map((dateItem) => {
                        return (
                          <div
                            key={dateItem}
                            style={{ marginBottom: 20, marginTop: 20 }}
                          >
                            <div
                              style={{
                                display: "flex",
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: "white",
                                }}
                              >
                                <HistoryIcon
                                  style={{ color: "gray", marginRight: 10 }}
                                />{" "}
                              </div>
                              <div style={{ color: "gray" }}>
                                {dateItem["dateLabel"] || "N/A"}
                              </div>
                            </div>
                            <div
                              style={{
                                padding: 20,
                                marginTop: 10,
                                marginLeft: 15,
                                backgroundColor: "#f7f7f7",
                                borderLeft: "1px solid #979797",
                              }}
                            >
                              {(dateItem["sectionsDetailsList"] || [])?.map(
                                (item) => {
                                  return (
                                    <div
                                      key={item}
                                      style={{
                                        fontSize: 14,
                                        padding: "8px 0px",
                                        borderBottom: "1px solid #d9d9d9",
                                        display: "flex",
                                      }}
                                    >
                                      {" "}
                                      <b>
                                        {" "}
                                        {item.courseLabel || "N/A"} -{" "}
                                        {item.sectionLabel || "N/A"}{" "}
                                      </b>{" "}
                                      <div
                                        style={{
                                          marginLeft: 20,
                                          color: `${
                                            item.isActive == 1 ? "green" : "red"
                                          }`,
                                          border: `1px solid ${
                                            item.isActive == 1 ? "green" : "red"
                                          }`,
                                          padding: 3,
                                        }}
                                      >
                                        {item.isActive == 1
                                          ? "Assigned"
                                          : "Unassigned"}
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          marginLeft: 10,
                                          color: "gray",
                                        }}
                                      >
                                        - {item.timeLabel || "N/A"}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </Fragment>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "90%",
                        fontSize: 18,
                        color: "gray",
                        marginTop: 20,
                      }}
                    >
                      <HistoryIcon
                                  style={{ color: "gray", marginRight: 10 }}
                                />{" "} No History Found !
                    </div>
                  )}
                </Fragment>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 50,
                    width: "100%",
                    overflow: "hidden",
                    height: "90px",
                  }}
                >
                  <CircularProgress />
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
        />
      </Fragment>
    );
  }
}

R317TeacherCoursesHistory.propTypes = {
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

R317TeacherCoursesHistory.defaultProps = {
  isDrawerOpen: true,
  classes: {},
  setDrawerOpen: (fn) => fn,
};

export default withStyles(styles)(R317TeacherCoursesHistory);
