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
import R345MasterAttendanceLogsViewTableComponent from "./R345MasterAttendanceLogsViewTableComponent";

// import {
//   TextField,
//   Grid,
//   Chip,
//   Tooltip,
//   Card,
//   CardContent,
// } from "@material-ui/core";

class R345MasterAttendanceLogs extends Component {
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
    // const formData = new FormData();
    // formData.append("recordId", 0);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/CommonEmployeeAttendanceReportView?startDate=&endDate=`;
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

  getDataThroughDate = async (formattedDate) => {
    this.setState({
      isLoading: true,
    });
    // const formData = new FormData();/dashboard/R345MasterAttendanceLogs?fromDate=2024-10-09&toDate=2024-10-10

    // formData.append("recordId", 0);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/dashboard/R345MasterAttendanceLogs?fromDate=${this.state.fromDateToSend}&toDate=${formattedDate}`;
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
      isLoading: false,
    });
  };

  onHandleChange = (event) => {
    const { name, value } = event.target;

    const date = new Date(value);
    const formattedDate = date.toISOString().split("T")[0];

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
          toDate: null,
          toDateToSend: null,
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
    // this.getData();
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
      // { name: "ID", title: "ID", flex: 1 },
      { name: "Name", title: "Name", flex: 1 },
      { name: "Date", title: "Attendance Date", flex: 1 },
      { name: "Time", title: "Time", flex: 1 },
      { name: "Device Name", title: "Device Name", flex: 1 },
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
              Master Attendance Rawdata
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
                disabled={this.state.isLoading}
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
                disabled={!this.state.fromDate || this.state.isLoading}
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

          {this.state.isLoading ? (
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
            <R345MasterAttendanceLogsViewTableComponent
              rows={this.state.employeePayrollsData}
              columns={columns}
              showFilter={this.state.showTableFilter}
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
export default R345MasterAttendanceLogs;
