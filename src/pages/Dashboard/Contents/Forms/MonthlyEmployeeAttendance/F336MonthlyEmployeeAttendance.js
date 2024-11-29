import React, { Component, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { DatePicker } from "@material-ui/pickers";

import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import {
  Divider,
  CircularProgress,
  Grid,
  Button,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  MenuItem,
} from "@material-ui/core";
import F336MonthlyEmployeeAttendanceTableComponent from "./chunks/F336MonthlyEmployeeAttendanceTableComponent";
import { IsEmpty } from "../../../../../utils/helper";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import { withRouter } from "react-router-dom";
import { Record } from "mdi-material-ui";
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
  disabledTextField: {
    "& .MuiInputBase-input.Mui-disabled": {
      color: "black", // Change the text color to black
    },
    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
      borderColor: "black", // Optionally, change the border color to black
    },
  },
});

class F336MonthlyEmployeeAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      recordId: null,
      isApprovedByHead: 0,

      isLoginMenu: false,
      isReload: false,

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      yearId: "",
      yearData: [],
      academicSessionsData: [],
      academicSessionsDataLoading: false,
      academicSessionId: "",
      academicSessionIdError: "",

      programmeGroupsData: [],
      programmeGroupsDataLoading: false,
      programmeGroupId: "",
      programmeGroupIdError: "",

      monthsData: [
        { id: 1, label: "January" },
        { id: 2, label: "February" },
        { id: 3, label: "March" },
        { id: 4, label: "April" },
        { id: 5, label: "May" },
        { id: 6, label: "June" },
        { id: 7, label: "July" },
        { id: 8, label: "August" },
        { id: 9, label: "September" },
        { id: 10, label: "October" },
        { id: 11, label: "November" },
        { id: 12, label: "December" },
      ],
      monthsDataLoading: false,
      monthId: "",
      monthIdError: "",

      expandedGroupsData: [],

      fromDate: null,
      toDate: null,
      fromDateToSend: null,
      toDateToSend: null,

      teachersAttendanceSheetData: [],

      isApproved: false,
    };
  }
  componentDidMount() {
    const { recordId } = this.props.match.params;

    // this.props.setDrawerOpen(false);
    this.getAcademicSessions();

    this.setState({ recordId: recordId }, () => {
      // this.onSearchClick();
    });
  }

  dateToGetThrough = (date) => {
    const [day, month, year] = date.split("-");

    const dateObj = new Date(`${year}-${month}-${day}`);

    const formattedDate = dateObj.toString();

    return formattedDate;
  };

  getYearsData = async (value) => {
    this.setState({
      isLoading: true,
    });

    const formData = new FormData();
    formData.append("sessionId", value);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C330CommonMonthsView`;
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
                this.setState({ academicSessionId: sessionId });
                this.getYearsData(sessionId);
                // this.getProgrammeGroupsBySessionId(sessionId);
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

  // getProgrammeGroupsBySessionId = async (academicSessionId) => {
  //   let mySessionId = academicSessionId;

  //   this.setState({
  //     programmeGroupsDataLoading: true,
  //     programmeGroupsData: [],
  //   });
  //   let data = new FormData();
  //   data.append("academicsSessionId", mySessionId);
  //   const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C322CommonAcademicsProgrammesGroupsView`;
  //   await fetch(url, {
  //     method: "POST",
  //     body: data,
  //     headers: new Headers({
  //       Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
  //     }),
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw res;
  //       }
  //       return res.json();
  //     })
  //     .then(
  //       (json) => {
  //         if (json.CODE === 1) {
  //           this.setState({ programmeGroupsData: json.DATA });
  //         } else {
  //           this.handleSnackbar(
  //             true,
  //             <span>
  //               {json.SYSTEM_MESSAGE}
  //               <br />
  //               {json.USER_MESSAGE}
  //             </span>,
  //             "error"
  //           );
  //         }
  //       },
  //       (error) => {
  //         if (error.status == 401) {
  //           this.setState({
  //             isLoginMenu: true,
  //             isReload: true,
  //           });
  //         } else {
  //           this.handleSnackbar(
  //             true,
  //             "Failed to fetch ! Please try Again later.",
  //             "error"
  //           );
  //         }
  //       }
  //     );
  //   this.setState({ programmeGroupsDataLoading: false });
  // };

  onSearchClick = async (e) => {
    if (!IsEmpty(e)) {
      e.preventDefault();
    }
    // var data = new FormData();
    // data.append("recordId", this.state.recordId);
    // data.append("academicsSessionId", this.state.academicSessionId);
    // data.append("monthEnum", this.state.monthId.monthName);
    // data.append("year", 0);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C336CommonEmployeePayroleAttendanceView?fromDate=${this.state.fromDateToSend}&toDate=${this.state.toDateToSend}`;
    await fetch(url, {
      method: "POST",
      // body: data,
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

            // let myExpandedGroupsData = [];
            // for (let i = 0; i < array.length; i++) {
            //   myExpandedGroupsData.push(array[i]["teacherLabel"]);
            // }

            // let isApproved = false;
            // if (array.length > 0) {
            //   isApproved = array[0]["isApproved"] || false;
            // }

            this.setState({
              teachersAttendanceSheetData: array,
              expandedGroupsData: array,
              // academicSessionId: json.DATA[0].sessionLabel,
              // programmeGroupId: json.DATA[0].programmeGroupLabel,
              // monthId: json.DATA[0].monthLabel,
              // isApprovedByHead: json.DATA[0].isApproved,
              // yearId: json.DATA[0].year,
              // isApproved,
            });
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

  onApproveClick = async (e) => {
    if (!IsEmpty(e)) {
      e.preventDefault();
    }

    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C336CommonEmployeePayroleAttendanceSave`;
    // var data = new FormData();
    const { teachersAttendanceSheetData } = this.state;
    let array = [];
    const groupedData = teachersAttendanceSheetData.map((acc) => {
      const courseDetail = {
        ...acc,
      };

      array.push(courseDetail);
    });

    const data = {
      academicSessionId: this.state.academicSessionId,
      yearId: this.state.yearId,
      monthId: this.state.monthId.id,
      attendanceDetail: array,
    };

    console.log(data);

    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
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
      academicSessionId: sessionId,
      academicSessionIdError: "",
      academicSessionsDataLoading: false,

      programmeGroupId: "",
      programmeGroupIdError: "",

      teachersAttendanceSheetData: [],
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;

    switch (name) {
      case "academicSessionId":
        this.setState({
          teachersAttendanceSheetData: [],
          programmeGroupId: "",
          programmeGroupIdError: "",
        });
        this.getProgrammeGroupsBySessionId(value);
        break;
      case "programmeGroupId":
        this.setState({
          teachersAttendanceSheetData: [],
        });
        break;
      default:
        break;
    }

    if (name === "academicSessionId") {
      this.getYearsData(value);
    }

    if (name === "monthId") {
      console.log("data");
      const fromDate = this.dateToGetThrough(value.fromDate);
      const toDate = this.dateToGetThrough(value.toDate);
      this.setState({
        [name]: value,
        fromDate: fromDate,
        toDate: toDate,
        fromDateToSend: value.fromDate,
        toDateToSend: value.toDate,
        [errName]: "",
      });
    } else {
      this.setState({
        [name]: value,
        [errName]: "",
      });
    }

    // this.setState({
    //   [name]: value,
    //   [errName]: "",
    // });
  };

  // getData = (data) => {
  //   const formattedArray = Object.entries(data[0]).map(
  //     ([monthName, dates]) => ({
  //       fromDate: dates[0],
  //       toDate: dates[1],
  //       monthName,
  //     })
  //   );

  //   const sortedArray = formattedArray.sort(
  //     (a, b) => new Date(a.fromDate) - new Date(b.fromDate)
  //   );

  //   const augustIndex = sortedArray.findIndex((item) =>
  //     item.monthName.includes("August")
  //   );
  //   const rearrangedArray = [
  //     ...sortedArray.slice(augustIndex),
  //     ...sortedArray.slice(0, augustIndex),
  //   ];

  //   return rearrangedArray;
  // };
  handleRatePerHourChange = (value, rowData) => {
    const { id } = rowData;
    const updatedData = this.state.teachersAttendanceSheetData.map((item) =>
      item.id === id
        ? {
            ...item,
            adjustedLateDays: Number(value),
            // totalNetHours: Number(value) + item.totalHours,
            // totalAmount: (Number(value) + item.totalHours) * item.ratePerHour,
          }
        : item
    );
    this.setState({
      teachersAttendanceSheetData: updatedData,
    });
  };

  handleAdjustedHourChange = (value, rowData) => {
    const { id } = rowData;
    const updatedData = this.state.teachersAttendanceSheetData.map((item) =>
      item.id === id
        ? {
            ...item,
            remarks: value,
          }
        : item
    );
    this.setState({
      teachersAttendanceSheetData: updatedData,
    });
  };

  render() {
    const { classes } = this.props;

    const columns = [
      { name: "id", title: "ID" },
      { name: "displayName", title: "Name" },
      { name: "totalWorkingDays", title: "Working Days" },
      { name: "totalAttendedDays", title: "Attended" },
      { name: "totalAttendanceMissingDays", title: "Att. Missing" },
      {
        name: "missingAttendanceDates",
        title: "Att. Missing Dates",
        getCellValue: (rowData) => {
          const splitStringByLength = (str, length) => {
            let result = [];
            for (let i = 0; i < str.length; i += length) {
              result.push(str.substring(i, i + length));
            }
            return result;
          };

          const attendanceDates = rowData?.missingAttendanceDates || [];
          const chunkSize = 16;

          return (
            <div>
              {attendanceDates.map((item, index) => (
                <div key={`item-${index}`}>
                  {splitStringByLength(item, chunkSize).map(
                    (chunk, chunkIndex) => (
                      <div key={`chunk-${chunkIndex}`}>
                        {chunk}
                        <br />
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          );
        },
      },
      { name: "totalLateDays", title: "Late" },
      {
        name: "lateDates",
        title: "Late Dates",
        getCellValue: (rowData) => {
          const splitStringByLength = (str, length) => {
            let result = [];
            for (let i = 0; i < str.length; i += length) {
              result.push(str.substring(i, i + length));
            }
            return result;
          };

          const attendanceDates = rowData?.lateDates || [];
          const chunkSize = 16;

          return (
            <div>
              {attendanceDates.map((item, index) => (
                <div key={`item-${index}`}>
                  {splitStringByLength(item, chunkSize).map(
                    (chunk, chunkIndex) => (
                      <div key={`chunk-${chunkIndex}`}>
                        {chunk}
                        <br />
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          );
        },
      },

      // { name: "durationPerSession", title: "Late Days" },

      {
        name: "adjustedLateDays",
        title: "Adjusted Late Days",
        getCellValue: (rowData) => {
          console.log(rowData);

          return (
            <TextField
              variant="outlined"
              size="small"
              name="adjustedHours"
              // disabled={
              //   !this.state.academicSessionId ||
              //   !this.state.programmeGroupId ||
              //   !this.state.monthId ||
              //   this.state.teachersAttendanceSheetData?.length <= 0 ||
              //   this.state.isApproved
              // }
              type="number"
              value={rowData.adjustedLateDays || ""}
              onChange={(event) =>
                this.handleRatePerHourChange(event.target.value, rowData)
              }
            />
          );
        },
      },
      {
        name: "remarks",
        title: "Remarks",
        getCellValue: (rowData) => {
          console.log(rowData);

          return (
            <TextField
              variant="outlined"
              size="small"
              name="adjustedHours"
              // disabled={
              // !this.state.academicSessionId ||
              // !this.state.programmeGroupId ||
              // !this.state.monthId ||
              // this.state.teachersAttendanceSheetData?.length <= 0 ||
              // this.state.isApproved
              // }
              // type="number"
              value={rowData.remarks || ""}
              onChange={(event) =>
                this.handleAdjustedHourChange(event.target.value, rowData)
              }
            />
          );
        },
      },
      // { name: "ratePerHour", title: "Rate Per Hour" },
      // { name: "totalAmount", title: "Total Amount" },
      // { name: "adjustmentRemarks", title: "Adjustment Remarks" },
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
              {/* <Tooltip title="Back">
                <IconButton onClick={() => window.history.back()}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip> */}
              {"Monthly Employee Late Days"}
              <br />
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <br />
          <Grid container justify="left" alignItems="left" spacing={2}>
            <Grid item xs={12} md={2}>
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
                {this.state.academicSessionsData?.map((item) => (
                  <MenuItem key={item} value={item.ID}>
                    {item.Label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <br />
            {/* <Grid item xs={12} md={2}>
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
                {this.state.programmeGroupsData?.map((item) => (
                  <MenuItem key={item} value={item.Id}>
                    {item.Label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}
            {/* <Grid item xs={12} md={2}>
              <TextField
                id="yearId"
                name="yearId"
                variant="outlined"
                label="Year"
                onChange={this.onHandleChange}
                value={this.state.yearId}
                // error={!!this.state.academicSessionIdError}
                // helperText={this.state.academicSessionIdError}
                required
                fullWidth
                select
              >
                {this.state.yearData?.map((item) => (
                  <MenuItem key={item} value={item.ID}>
                    {item.Label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}
            <Grid item xs={12} md={2}>
              <TextField
                id="monthId"
                name="monthId"
                variant="outlined"
                label="Month"
                onChange={this.onHandleChange}
                value={this.state.monthId}
                error={!!this.state.monthIdError}
                helperText={this.state.monthIdError}
                required
                fullWidth
                select
              >
                {this.state.yearData?.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item.monthName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <DatePicker
                autoOk
                id="fromDate"
                name="fromDate"
                label="From Date"
                invalidDateMessage=""
                disabled={Object.keys(this.state.yearId).length === 0}
                placeholder=""
                variant="inline"
                inputVariant="outlined"
                format="dd-MM-yyyy"
                fullWidth
                required
                value={this.state.fromDate}
                onChange={(date) =>
                  this.onHandleChangeDate({
                    target: { name: "fromDate", value: date },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <DatePicker
                autoOk
                id="toDate"
                name="toDate"
                label="To Date"
                invalidDateMessage=""
                disabled={Object.keys(this.state.yearId).length === 0}
                placeholder=""
                variant="inline"
                inputVariant="outlined"
                format="dd-MM-yyyy"
                fullWidth
                required
                // disabled={!this.state.fromDate}
                value={this.state.toDate}
                onChange={(date) =>
                  this.onHandleChangeDate({
                    target: { name: "toDate", value: date },
                  })
                }
                // disablePast
                // shouldDisableDate={(day) => {
                //   const fromDate = this.state.fromDate;
                //   if (fromDate) {
                //     console.log(fromDate);
                //     return day <= fromDate;
                //   }
                //   return false;
                // }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <div className={classes.actions}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={
                    this.state.isLoading ||
                    this.state.academicSessionsDataLoading ||
                    // this.state.programmeGroupsDataLoading ||
                    !this.state.academicSessionId ||
                    // !this.state.programmeGroupId ||
                    !this.state.monthId
                  }
                  onClick={(e) => this.onSearchClick(e)}
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
                </Button>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.divider} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <F336MonthlyEmployeeAttendanceTableComponent
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
            left_button_hide
            // left_button_text="View"
            // left_button_hide={false}
            // bottomLeftButtonAction={this.viewReport}
            right_button_text={this.state.isApproved ? "Saved" : "Save"}
            disableRightButton={this.state.isApprovedByHead === 1}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            bottomRightButtonAction={() => this.onApproveClick()}
          />
        </div>
      </Fragment>
    );
  }
}

F336MonthlyEmployeeAttendance.propTypes = {
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

F336MonthlyEmployeeAttendance.defaultProps = {
  classes: {},
  setDrawerOpen: (fn) => fn,
};
export default withRouter(withStyles(styles)(F336MonthlyEmployeeAttendance));
