import React, { Component, Fragment } from "react";
import {
  Divider,
  IconButton,
  Tooltip,
  Button,
  TextField,
  Grid,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";

import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import R342AllEmployeeGateAttendanceViewTableComponent from "./R342AllEmployeeGateAttendanceViewTableComponent";

class R342AllEmployeeGateAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      employeePayrollsData: [],
      isLoginMenu: false,
      isReload: true,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      fromDate: new Date(),
      toDate: new Date(),
      toDateOptions: [],

      fromDateToSend: null,
      toDateToSend: null,
      loading: false,
    };
  }

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  getDataThroughDate = async (formattedDate) => {
    this.setState({
      loading: true,
      employeePayrollsData: [],
    });

    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C342AllEmployeesGateAttendanceView?fromDate=${this.state.fromDateToSend}&toDate=${formattedDate}`;
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
              employeePayrollsData: data,
            });
          } else {
            this.handleSnackbar(
              true,
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
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
      loading: false,
    });
  };

  getData = async () => {
    this.setState({ loading: true });
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
    this.setState({
      isLoading: true,
    });

    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C342AllEmployeesGateAttendanceView?fromDate=${formattedDate}&toDate=${formattedDate}`;
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
              employeePayrollsData: data,
            });
          } else {
            this.handleSnackbar(
              true,
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
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
      loading: false,
    });
  };

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

      this.getDataThroughDate(formattedDate);
    }

    this.setState({
      [name]: value,
    });
  };

  filterToDateOptions = () => {
    const { fromDate } = this.state;
    if (fromDate) {
      const filteredOptions = [fromDate];
      this.setState({
        toDateOptions: filteredOptions,
      });
    }
  };
  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  componentDidMount() {
    this.getData();
  }

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  shouldDisableDate = (date) => {
    const { fromDate } = this.state;
    if (fromDate) {
      // Create new Date objects to avoid mutation
      const startOfFromDate = new Date(fromDate);
      startOfFromDate.setHours(0, 0, 0, 0);
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);
      return compareDate < startOfFromDate;
    }
    return false;
  };
  render() {
    const columns = [
      { name: "userId", title: "Employee Id", flex: 1 },
      { name: "userName", title: "Employee Name", flex: 1 },

      { name: "attendanceDate", title: "Attendance Date", flex: 1 },

      { name: "checkIn", title: "Check-in Time", flex: 1 },
      { name: "checkOut", title: "Check-out Time", flex: 1 },

      // {
      //   name: "status",
      //   title: "Status",
      //   flex: 1,
      //   getCellValue: (rowData) => {
      //     return (
      //       <div
      //         style={{
      //           color: "green",
      //           padding: "7px 20px",
      //           background: "#bbf7d0",
      //           width: "17%",
      //           borderRadius: "4px",
      //         }}
      //       >
      //         {"Present"}
      //       </div>
      //     );
      //   },
      // },
    ];

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <div
          style={{
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              All Employees Gate Attendance
            </Typography>
            <div style={{ float: "right" }}>
              <Tooltip title="Table Filter">
                <IconButton
                  style={{ marginLeft: "-10px" }}
                  onClick={() => this.handleToggleTableFilter()}
                >
                  <FilterIcon fontSize="default" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <Grid
            container
            spacing={2}
            style={{
              marginLeft: 5,
              marginRight: 15,
              marginBottom: 20,
            }}
          >
            <Grid item xs={12} md={4}>
              <DatePicker
                autoOk
                id="fromDate"
                name="fromDate"
                label="From Date"
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

            <Grid item xs={12} md={4}>
              <DatePicker
                autoOk
                id="toDate"
                name="toDate"
                label="To Date"
                invalidDateMessage=""
                placeholder=""
                variant="inline"
                inputVariant="outlined"
                format="dd-MM-yyyy"
                fullWidth
                required
                disabled={!this.state.fromDate}
                value={this.state.toDate}
                onChange={(date) =>
                  this.onHandleChange({
                    target: { name: "toDate", value: date },
                  })
                }
                shouldDisableDate={this.shouldDisableDate}
                minDate={this.state.fromDate}
              />
            </Grid>
          </Grid>

          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
              marginBottom: 20,
            }}
          />

          {this.state.loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress color="primary" />
            </div>
          ) : (
            <R342AllEmployeeGateAttendanceViewTableComponent
              rows={this.state.employeePayrollsData}
              columns={columns}
              showFilter={this.state.showTableFilter}
              loading={this.state.loading}
            />
          )}

          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
          />
        </div>
      </Fragment>
    );
  }
}
export default R342AllEmployeeGateAttendance;
