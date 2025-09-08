import React, { Component, Fragment } from "react";
import {
  Divider,
  IconButton,
  Tooltip,
  Button,
  TextField,
  Grid,
  Chip,
} from "@material-ui/core";
import { DatePicker, KeyboardTimePicker } from "@material-ui/pickers";

import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import R338AttendanceDailyReportViewTableComponent from "./R338AttendanceDailyReportViewTableComponent";
import { Link } from "react-router-dom";
import { BorderRadius } from "mdi-material-ui";
import EditIcon from "@material-ui/icons/Edit";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
// import {
//   TextField,
//   Grid,
//   Chip,
//   Tooltip,
//   Card,
//   CardContent,
// } from "@material-ui/core";

class R338AttendanceDailyReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      employeePayrollsData: [],
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      fromDate: null,
      toDate: null,
      toDateOptions: [],

      fromDateToSend: null,
      toDateToSend: null,
    };
  }

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  getData = async () => {
    this.setState({
      isLoading: true,
    });
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);
    const previousMonthDate = new Date(currentDate);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    if (previousMonthDate.getMonth() === currentDate.getMonth()) {
      previousMonthDate.setDate(0);
    }
    const formattedPreviousMonthDate = formatDate(previousMonthDate);

    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/CommonEmployeeAttendanceReportView?startDate=${formattedPreviousMonthDate}&endDate=${formattedCurrentDate}`;
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
            let data = json.DATA || [];
            const currentDate = new Date();
            const previousMonthDate = new Date(currentDate);
            previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

            if (previousMonthDate.getMonth() === currentDate.getMonth()) {
              previousMonthDate.setDate(0);
            }
            this.setState({
              employeePayrollsData: data,
              fromDate: previousMonthDate,
              toDate: currentDate,
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
      isLoading: false,
    });
  };

  getDataThroughDate = async (formattedDate) => {
    this.setState({
      isLoading: true,
    });
    // const formData = new FormData();
    // formData.append("recordId", 0);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/CommonEmployeeAttendanceReportView?startDate=${this.state.fromDateToSend}&endDate=${formattedDate}`;
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

            // for (let i = 0; i < data.length; i++) {
            //   const id = data[i].id;
            //   data[i].action = (
            //     <EditDeleteTableComponent
            //       hideEditAction
            //       recordId={id}
            //       deleteRecord={this.DeleteData}
            //       editRecord={() =>
            //         window.location.replace(
            //           `#/dashboard/F315DefineEmployeesPayroll/${id}`
            //         )
            //       }
            //     />
            //   );
            // }
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
      isLoading: false,
    });
  };

  onHandleChange = (event) => {
    const { name, value } = event.target;

    const date = new Date(value);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;

    if (name === "fromDate") {
      if (this.state.toDate && value && this.state.toDate < value) {
        this.setState({
          fromDate: value,
          fromDateToSend: formattedDate,
          toDate: null,
          toDateToSend: null,
        });
      } else {
        this.setState({
          fromDate: value,
          fromDateToSend: formattedDate,
        });
      }
    } else if (name === "toDate") {
      this.setState(
        {
          toDate: value,
          toDateToSend: formattedDate,
        },
        () => {
          this.getDataThroughDate(formattedDate);
        }
      );
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
      { name: "attendanceDate", title: "Attendance Date", flex: 1 },
      // { name: "attendanceIn", title: "Check-in Time", flex: 1 },
      // { name: "attendanceOut", title: "Check-out Time", flex: 1 },
      {
        name: "checkIn",
        title: "Check-in Time",
        flex: 1,
        getCellValue: (rowData) => {
          return (
            <>
              {rowData.checkInCheckOut.length !== 0 ? (
                rowData.checkInCheckOut.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      borderBottom:
                        index === rowData.checkInCheckOut.length - 1
                          ? "none"
                          : "1px solid #DADBDD",
                      minHeight: "30px",
                    }}
                  >
                    {item.checkIn}
                  </div>
                ))
              ) : (
                <div style={{ minHeight: "30px" }}></div>
              )}
            </>
          );
        },
      },
      {
        name: "checkOut",
        title: "Check-out Time",
        flex: 1,
        getCellValue: (rowData) => {
          return (
            <>
              {rowData.checkInCheckOut.length !== 0 ? (
                rowData.checkInCheckOut.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      borderBottom:
                        index === rowData.checkInCheckOut.length - 1
                          ? "none"
                          : "1px solid #DADBDD",
                      minHeight: "30px",
                    }}
                  >
                    {item.checkOut}
                  </div>
                ))
              ) : (
                <div style={{ minHeight: "30px" }}></div>
              )}
            </>
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
              Daily Attendance Report
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
          {/* <Typography
            style={{
              color: "#1d5f98",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
            variant="h6"
          >
            {/* <Tooltip title="Back">
                <IconButton
                  onClick={() =>
                    window.location.replace(
                      "#/dashboard/F327DefineEmployeesLoan/0"
                    )
                  }
                >
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip> 
            ID : {this.state?.employeePayrollsData[0]?.id}
          </Typography> */}
          <Typography
            style={{
              color: "#1d5f98",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
            variant="h6"
          >
            Employee ID : {this.state?.employeePayrollsData[0]?.userId}
          </Typography>
          <Typography
            style={{
              color: "#1d5f98",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
            variant="h6"
          >
            Employee Name : {this.state?.employeePayrollsData[0]?.userName}
          </Typography>
          <R338AttendanceDailyReportViewTableComponent
            rows={this.state.employeePayrollsData}
            columns={columns}
            showFilter={this.state.showTableFilter}
          />
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
export default R338AttendanceDailyReport;
