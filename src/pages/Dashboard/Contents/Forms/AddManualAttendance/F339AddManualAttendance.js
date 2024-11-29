import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DatePicker, KeyboardTimePicker } from "@material-ui/pickers";
import {
  Divider,
  CircularProgress,
  Grid,
  Button,
  Typography,
  TextField,
  Chip,
  MenuItem,
} from "@material-ui/core";
import F339AddManualAttendancesTableComponent from "./chunks/F339AddManualAttendancesTableComponent";
import { IsEmpty } from "../../../../../utils/helper";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import ViewTableRecord from "../../../../../components/EditDeleteTableRecord/ViewTableRecord";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = () => ({
  mainContainer: {
    padding: 20,
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    color: "#1d5f98",
    fontWeight: 600,
    textTransform: "capitalize",
  },
  divider: { backgroundColor: "rgb(58, 127, 187)", opacity: "0.3" },
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

class F339AddManualAttendances extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,

      isLoginMenu: false,
      isReload: false,

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      employeePayrollsData: [],

      yearData: [],
      yearId: "",

      isApproved: false,

      employeeData: [],
      employeeDataLoading: false,
      employeeObject: {},
      employeeObjectError: "",

      startTime: null,
      endTime: null,
      startTimeToSend: null,
      endTimeToSend: null,

      enabledField: false,

      fromDate: null,
      fromDateToSend: null,

      employeeId: "",
    };
  }
  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getAcademicSessions();
    // this.getData();
    // this.getEmployeesData();
  }

  onHandleChange = (event) => {
    const { name, value } = event.target;
    const date = new Date(value);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;

    if (name === "fromDate") {
      this.setState({
        fromDateToSend: formattedDate,
      });
    } else {
      this.setState({
        toDateToSend: formattedDate,
      });
    }

    this.setState({
      [name]: value,
    });

    console.log(formattedDate);

    this.getEmployeesData(formattedDate);
  };
  getEmployeesData = async (formattedDate) => {
    this.setState({ employeeDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/EmployeesForAttendanceView?date=${formattedDate}`;
    await fetch(url, {
      method: "GET",
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
              employeeData: json.DATA || [],
            });
          } else {
            this.handleSnackbar(
              true,
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
              "error"
            );
          }
          console.log(json);
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
              "Failed to Get Data ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ employeeDataLoading: false });
  };

  getData = async () => {
    this.setState({
      isLoading: true,
    });
    // const formData = new FormData();
    // formData.append("recordId", 0);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/EmployeesForAttendanceView?date`;
    await fetch(url, {
      method: "GET",
      // body: formData,
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

            this.setState({
              // employeePayrollsData: data.slice(0, 30),
              employeePayrollsData: data,
            });
          } else {
            this.handleSnackbar(
              true,
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            this.handleSnackbar(
              true,
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({
      isLoading: false,
    });
  };

  getYearsData = async (value) => {
    this.setState({
      isLoading: true,
    });

    const formData = new FormData();
    formData.append("sessionId", value);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C331CommonYearsView`;
    await fetch(url, {
      method: "POST",
      body: formData,
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
            this.setState({
              yearData: data,
            });
          } else {
            this.handleSnackbar(
              true,
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            this.handleSnackbar(
              true,
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({
      isLoading: false,
    });
  };

  getAcademicSessions = async () => {
    this.setState({ academicSessionsDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C322CommonAcademicSessionsView`;
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
                const sessionId = array[i].ID;
                // this.setState({ academicSessionId: sessionId });

                this.getProgrammeGroupsBySessionId(sessionId);
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

  getProgrammeGroupsBySessionId = async (academicSessionId) => {
    let mySessionId = academicSessionId;

    this.setState({
      programmeGroupsDataLoading: true,
      programmeGroupsData: [],
    });
    let data = new FormData();
    data.append("academicsSessionId", mySessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C322CommonAcademicsProgrammesGroupsView`;
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
            this.setState({ programmeGroupsData: json.DATA });
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
            this.handleSnackbar(
              true,
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ programmeGroupsDataLoading: false });
  };

  onSearchClick = async (e) => {
    if (!IsEmpty(e)) {
      e.preventDefault();
    }
    this.setState({ isLoading: true });

    let formattedStartTime = "";

    if (this.state.startTime !== null) {
      formattedStartTime = `${this?.state?.startTime
        .getHours()
        .toString()
        .padStart(2, "0")}:${this?.state?.startTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${this.state.startTime
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
    }

    let formattedEndTime = "";

    if (this.state.endTime !== null) {
      formattedEndTime = `${this.state.endTime
        .getHours()
        .toString()
        .padStart(2, "0")}:${this.state.endTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${this.state.endTime
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
    }
    console.log(
      formattedEndTime,
      formattedStartTime,
      this.state.employeeObject
    );

    const obj = {
      employeeID: this.state.employeeObject.id,
      employeeName: this.state.employeeObject.name,
      date: this.state.fromDateToSend,
      checkIn: formattedStartTime,
      checkOut: formattedEndTime,
    };

    this.setState({
      isLoading: false,
      employeePayrollsData: [...this.state.employeePayrollsData, obj],
      employeeObject: {},
      startTime: null,
      endTime: null,
      // fromDate: null,
    });
  };

  onApproveClick = async (e) => {
    if (!IsEmpty(e)) {
      e.preventDefault();
    }

    const transformedData = this.state.employeePayrollsData.map((item) => {
      return {
        employeeId: item.employeeID,
        attendanceDate: item.date,
        checkIn: item.checkIn || null,
        checkOut: item.checkOut || null,
      };
    });
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/EmployeeManualAttendanceSave`;
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(transformedData),
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
        "Content-Type": "application/json",
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
            this.onSearchClick();
            this.handleSnackbar(true, "Approved", "success");
            this.onClearAllData();
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
              isReload: false,
            });
          } else {
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

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };
  viewReport = () => {
    window.location = "#/dashboard/F322Reports";
  };

  onClearAllData = () => {
    let sessionId = "";

    let array = this.state.academicSessionsData || [];
    let arrayLength = array.length;
    for (let i = 0; i < arrayLength; i++) {
      if (array[i].isActive == "1") {
        sessionId = array[i].ID || "";
      }
    }

    this.getProgrammeGroupsBySessionId(sessionId);

    this.setState({
      employeePayrollsData: [],

      yearData: [],
      yearId: "",

      isApproved: false,

      employeeData: [],
      employeeDataLoading: false,
      employeeObject: {},
      employeeObjectError: "",

      startTime: null,
      endTime: null,
      startTimeToSend: null,
      endTimeToSend: null,

      enabledField: false,

      fromDate: null,
      fromDateToSend: null,

      employeeId: "",
    });
  };

  handleFormatChange = (time) => {
    console.log(time, this.state.fromDateToSend);
    const combinedDateTime = `${this.state.fromDateToSend}T${time}`;
    const dateTimeObject = new Date(combinedDateTime);
    const formattedDateTime = dateTimeObject.toString();
    if (formattedDateTime === "Invalid Date") {
      return formattedDateTime;
    } else {
      const dateObject = new Date(formattedDateTime);
      return dateObject;
    }
  };

  onHandleChanges = (e) => {
    const { name, value } = e.target;
    console.log(value);
    const startTimetoPopulate = this.handleFormatChange(value?.checkIn);
    const endTimeToPopulate = this.handleFormatChange(value?.checkOut);
    if (
      startTimetoPopulate !== "Invalid Date" &&
      endTimeToPopulate !== "Invalid Date"
    ) {
      this.setState({
        [name]: value,
        startTime: startTimetoPopulate,
        endTime: endTimeToPopulate,
        enabledField: true,
      });
    } else if (
      startTimetoPopulate !== "Invalid Date" &&
      endTimeToPopulate === "Invalid Date"
    ) {
      this.setState({
        [name]: value,
        startTime: startTimetoPopulate,
        endTime: null,
        enabledField: false,
      });
    } else if (
      startTimetoPopulate === "Invalid Date" &&
      endTimeToPopulate !== "Invalid Date"
    ) {
      this.setState({
        [name]: value,
        startTime: null,
        endTime: endTimeToPopulate,
        enabledField: false,
      });
    } else {
      this.setState({
        [name]: value,
        startTime: null,
        endTime: null,
        enabledField: false,
      });
    }
  };

  handleDateChangeStartTime = (date) => {
    console.log(date);
    this.setState({ startTime: date });
  };

  handleDateChangeEndTime = (date) => {
    this.setState({ endTime: date });
  };

  handleDelete = (rowData) => {
    const filterData = this.state.employeePayrollsData.filter(
      (item) => item.employeeID !== rowData.employeeID
    );

    console.log(filterData);

    this.setState({
      employeePayrollsData: [...filterData],
    });
  };

  render() {
    const { classes } = this.props;

    const columns = [
      { name: "employeeID", title: "Employee ID" },
      { name: "employeeName", title: "Employee Name" },
      {
        name: "checkIn",
        title: "Check-in Time",
      },

      {
        name: "checkOut",
        title: "Check-out Time",
      },

      {
        name: "actions",
        title: "Action",
        getCellValue: (rowData) => {
          // console.log(rowData);
          return (
            <button
              onClick={() => this.handleDelete(rowData)}
              style={{
                padding: "0px",
                background: "white",
                border: "none",
                color: "red",
              }}
            >
              <DeleteIcon />
            </button>
          );
        },
      },
    ];

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <div className={classes.mainContainer}>
          <div className={classes.titleContainer}>
            <Typography className={classes.title} variant="h5">
              {"Add Manual Attendance"}
              <br />
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <br />
          <Grid container justify="left" alignItems="left" spacing={2}>
            <Grid item xs={12} md={2}>
              <DatePicker
                autoOk
                id="fromDate"
                disabled={this.state.fromDate}
                name="fromDate"
                label="Date"
                invalidDateMessage=""
                placeholder=""
                variant="inline"
                inputVariant="outlined"
                format="dd-MM-yyyy"
                fullWidth
                required
                value={this.state.fromDate}
                onChange={(date) =>
                  this.onHandleChange({
                    target: { name: "fromDate", value: date },
                  })
                }
              />
            </Grid>

            <br />
            <Grid item xs={12} md={2}>
              <Autocomplete
                id="employeeObject"
                disabled={!this.state.fromDate}
                getOptionLabel={(option) =>
                  typeof option.name == "string" ? option.name : ""
                }
                getOptionSelected={(option, value) => option.id === value.id}
                fullWidth
                aria-autocomplete="none"
                options={this.state.employeeData}
                loading={this.state.employeeDataLoading}
                value={this.state.employeeObject}
                onChange={(e, value) =>
                  this.onHandleChanges({
                    target: { name: "employeeObject", value },
                  })
                }
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      key={option}
                      label={option.name}
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
                      label="Employee *"
                      {...params}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <KeyboardTimePicker
                id="startTime"
                name="startTime"
                label="Check-in Time"
                required
                disabled={!this?.state?.employeeObject?.id}
                // disabled={Object.keys(this.state.employeeObject.length === 0)}
                fullWidth
                style={{
                  marginTop: "0px",
                }}
                variant="outlined"
                margin="normal"
                value={this.state.startTime}
                onChange={this.handleDateChangeStartTime}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
                InputProps={{
                  variant: "outlined",
                }}
                inputVariant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <KeyboardTimePicker
                id="endTime"
                name="endTime"
                label="Check-out Time"
                required
                disabled={!this?.state?.employeeObject?.id}
                fullWidth
                style={{
                  marginTop: "0px",
                }}
                variant="outlined"
                margin="normal"
                value={this.state.endTime}
                onChange={this.handleDateChangeEndTime}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
                InputProps={{
                  variant: "outlined",
                }}
                inputVariant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <div className={classes.actions}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={
                    this.state.enabledField ||
                    !this?.state?.employeeObject?.id ||
                    !this?.state?.fromDate ||
                    (!this?.state?.startTime && !this?.state?.endTime)
                  }
                  onClick={(e) => this.onSearchClick(e)}
                >
                  {" "}
                  {this.state.isLoading ? (
                    <CircularProgress style={{ color: "white" }} size={24} />
                  ) : (
                    "Add"
                  )}
                </Button>
                {/* <Button
                  variant="contained"
                  color="default"
                  className={classes.button}
                  disabled={
                    this.state.isLoading ||
                    this.state.academicSessionsDataLoading ||
                    this.state.programmeGroupsDataLoading
                  }
                  onClick={() => this.onClearAllData()}
                  style={{
                    marginLeft: 8,
                  }}
                >
                  Clear
                </Button> */}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.divider} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <F339AddManualAttendancesTableComponent
              columns={columns}
              data={this.state}
            />
          </Grid>

          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
          />

          <BottomBar
            // left_button_hide
            left_button_text="View"
            left_button_hide={true}
            bottomLeftButtonAction={this.viewReport}
            right_button_text={this.state.isApproved ? "Saved" : "Save"}
            disableRightButton={this.state.employeePayrollsData.length === 0}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            bottomRightButtonAction={() => this.onApproveClick()}
          />
        </div>
      </Fragment>
    );
  }
}

F339AddManualAttendances.propTypes = {
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

F339AddManualAttendances.defaultProps = {
  classes: {},
  setDrawerOpen: (fn) => fn,
};
export default withStyles(styles)(F339AddManualAttendances);
