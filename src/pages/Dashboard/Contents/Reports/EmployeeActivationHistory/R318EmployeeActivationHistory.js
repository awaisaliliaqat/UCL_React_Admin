import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import {
  TextField,
  Grid,
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

class R318EmployeeActivationHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isReload: false,

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      employeesData: [],
      employeesDataLoading: false,
      employeeObject: {},
      employeeObjectError: "",

      userObject: {},
      employeeActivationHistoryData: [],
    };
  }

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  getAllTeachersData = async () => {
    this.setState({ employeesDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C318CommonUsersView`;
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
            this.setState({ employeesData: array });
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
    this.setState({ employeesDataLoading: false });
  };

  onSearchClick = async (e) => {
    if (!IsEmpty(e)) {
      e.preventDefault();
    }
    this.setState({ isLoading: true, employeeActivationHistoryData: [] });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/common/C318CommonUsersActivationHistoryView?employeeId=${
      this.state.employeeObject?.id || 0
    }`;
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
            if (array.length > 0) {
              let userObject = array[0] || {};
              let dateWiseList = userObject["dateWiseList"] || [];
              this.setState({
                employeeActivationHistoryData: dateWiseList,
                userObject,
              });
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
    this.setState({ isLoading: false });
  };

  onClearClick = () => {
    this.setState({
      employeeObject: {},
      employeeObjectError: "",

      userObject: {},
      employeeActivationHistoryData: [],
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;

    switch (name) {
      case "employeeObject":
        this.setState({
          employeeActivationHistoryData: [],
          userObject: {},
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
            Employee Activation History
          </Typography>
          <Divider className={classes.dividerStyle} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                id="employeeObject"
                getOptionLabel={(option) =>
                  typeof option.label == "string" ? option.label : ""
                }
                getOptionSelected={(option, value) => option.id === value.id}
                fullWidth
                aria-autocomplete="none"
                options={this.state.employeesData}
                loading={this.state.employeesDataLoading}
                value={this.state.employeeObject}
                onChange={(e, value) =>
                  this.onHandleChange({
                    target: { name: "employeeObject", value },
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
                      error={!!this.state.employeeObjectError}
                      helperText={this.state.employeeObjectError}
                      inputProps={inputProps}
                      label="Employee"
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
                    this.state.isLoading || IsEmpty(this.state.employeeObject)
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
                  {!IsEmpty(this.state.userObject) && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: 25,
                        marginBottom: 20,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 600,
                        }}
                      >
                        {this.state.userObject.label || "N/A"}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          marginTop: 15,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            color: "gray",
                          }}
                        >
                          Current Status:{" "}
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            marginLeft: 15,
                            marginTop: "-5px",
                            color: `${
                              this.state.userObject.isActive == 1
                                ? "green"
                                : "red"
                            }`,
                          }}
                        >
                          {this.state.userObject.isActive == 1
                            ? "Active"
                            : "De-Active"}
                        </div>
                      </div>
                      <div style={{
                        display: "flex",
                        marginTop: 17
                      }}>
                        <div
                          style={{
                            fontSize: 12,
                            color: "gray",
                          }}
                        >
                          Joining Date:{" "}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            marginLeft: 15,
                            marginRight: 15,
                            marginTop: "-5px",
                          }}
                        >
                          {this.state.userObject.joiningDateLabel || "N/A"}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "gray",
                          }}
                        >
                          Leaving Date:{" "}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            marginLeft: 15,
                            marginRight: 15,
                            marginTop: "-5px",
                          }}
                        >
                          {this.state.userObject.leavingDateLabel || "N/A"}
                        </div>
                      </div>
                    </div>
                  )}
                  {this.state.employeeActivationHistoryData.length > 0 ? (
                    <Fragment>
                      {this.state.employeeActivationHistoryData?.map(
                        (dateItem) => {
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
                                {(dateItem["employeesDetailsList"] || [])?.map(
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
                                        <div
                                          style={{
                                            color: `${
                                              item.isActive == 1
                                                ? "green"
                                                : "red"
                                            }`,
                                            border: `1px solid ${
                                              item.isActive == 1
                                                ? "green"
                                                : "red"
                                            }`,
                                            padding: 3,
                                          }}
                                        >
                                          {item.isActive == 1
                                            ? "Active"
                                            : "De-Active"}
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
                                        {item.isActive == 0 && (
                                          <>
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                color: "gray",
                                              }}
                                            >
                                              ,
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: 10,
                                                color: "gray",
                                              }}
                                            >
                                              Reason:{" "}
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: 10,
                                                fontSize: 16,
                                              }}
                                            >
                                              {item.reasonLabel || ""}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </Fragment>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        fontSize: 18,
                        color: "gray",
                        marginTop: 20,
                      }}
                    >
                      <HistoryIcon style={{ color: "gray", marginRight: 10 }} />{" "}
                      No History Found !
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

R318EmployeeActivationHistory.propTypes = {
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

R318EmployeeActivationHistory.defaultProps = {
  isDrawerOpen: true,
  classes: {},
  setDrawerOpen: (fn) => fn,
};

export default withStyles(styles)(R318EmployeeActivationHistory);
