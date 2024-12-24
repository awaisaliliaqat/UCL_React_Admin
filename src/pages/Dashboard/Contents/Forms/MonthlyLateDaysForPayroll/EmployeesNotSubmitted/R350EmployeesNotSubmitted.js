import React, { Component, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../../components/LoginMenu/LoginMenu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { DatePicker } from "@material-ui/pickers";

import CustomizedSnackbar from "../../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import MonthlyEmployeeLateDaysReportforPayrollTableComponent from "./chunks/MonthlyEmployeeLateDaysReportforPayrollTableComponent";
import { IsEmpty } from "../../../../../../utils/helper";
import BottomBar from "../../../../../../components/BottomBar/BottomBarWithViewColorBlue";
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

class EmployeesNotSubmitted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      id: null,
      isApprovedByHead: 0,

      isLoginMenu: false,
      isReload: false,

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      isExisted: 1,

      yearId: "",
      yearData: [],
      academicSessionsData: [],
      academicSessionsDataLoading: false,
      academicSessionId: "",
      academicSessionIdError: "",

      openDialog: false,
      selectedStudent: null,

      programmeGroupsData: [],
      programmeGroupsDataLoading: false,
      programmeGroupId: "",

      attendanceSheetId: 0,
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
    const { id } = this.props.match.params;
    console.log(id, " id is coming");
    // this.props.setDrawerOpen(false);

    const academicId = id.split("T")[0];
    const monthId = id.split("T")[1];
    if (academicId !== "" && monthId !== "") {
      this.getAcademicSessions(academicId, monthId);
    }

    // this.setState({ recordId: recordId }, () => {
    //   // this.onSearchClick();
    // });
  }

  dateToGetThrough = (date) => {
    const [day, month, year] = date.split("-");

    const dateObj = new Date(`${year}-${month}-${day}`);

    const formattedDate = dateObj.toString();

    return formattedDate;
  };

  handleOpenDialog = (student) => {
    console.log(student, "student");
    this.setState({
      openDialog: true,
      selectedStudent: student,
      undoReason: "",
    });
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false, selectedStudent: null });
  };

  getYearsData = async (value) => {
    this.setState({
      isLoading: true,
    });

    const formData = new FormData();
    formData.append("sessionId", value);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C336CommonMonthsView`;
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

  onSaveClick = async (e) => {
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
            this.handleSnackbar(true, "Saved", "success");
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

  getAcademicSessions = async (academicId, monthId) => {
    this.setState({ academicSessionsDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C350EmployeesNotSubmittedView?sessionId=${academicId}&sessionPayrollMonthId=${monthId}`;
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
            this.setState({
              academicSessionId: json.DATA[0],
              teachersAttendanceSheetData: json.DATA[0].employeeDate,
              expandedGroupsData: json.DATA[0].employeeDate,
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

  onSearchClick = async (e) => {
    if (!IsEmpty(e)) {
      e.preventDefault();
    }
    console.log(this.state.monthId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C336CommonEmployeePayroleAttendanceView?fromDate=${this.state.fromDateToSend}&toDate=${this.state.toDateToSend}&sessionId=${this.state.academicSessionId}&monthId=${this.state.monthId.id}&isReportingTo=1`;
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
            let array = json.DATA[0].data || [];

            // array.forEach((item) => {
            //   item.adjustedAbsentDays = 0;
            // });
            this.setState({
              teachersAttendanceSheetData: array,
              expandedGroupsData: array,
              isExisted: json.DATA[0].isExist,
              attendanceSheetId:
                json.DATA[0].attendanceSheetId !== ""
                  ? json.DATA[0].attendanceSheetId
                  : 0,
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
    console.log(this.state.teachersAttendanceSheetData);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C336CommonEmployeePayrollAttendanceSendForApproval?attendanceSheetId=${this.state.attendanceSheetId}`;
    // var data = new FormData();
    // const { teachersAttendanceSheetData } = this.state;
    // let array = [];
    // const groupedData = teachersAttendanceSheetData.map((acc) => {
    //   const courseDetail = {
    //     ...acc,
    //   };

    //   array.push(courseDetail);
    // });

    // const data = {
    //   academicSessionId: this.state.academicSessionId,
    //   yearId: this.state.yearId,
    //   monthId: this.state.monthId.id,
    //   attendanceDetail: array,
    // };

    // console.log(data);

    await fetch(url, {
      method: "POST",
      // body: JSON.stringify(data),
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
            this.onSearchClick();
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

    // let array = this.state.academicSessionsData || [];
    // let arrayLength = array.length;
    // for (let i = 0; i < arrayLength; i++) {
    //   if (array[i].isActive == "1") {
    //     sessionId = array[i].ID || "";
    //   }
    // }

    // this.getProgrammeGroupsBySessionId(sessionId);

    this.setState({
      isLoading: false,
      recordId: null,
      isApprovedByHead: 0,

      isLoginMenu: false,
      isReload: false,

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      isExisted: 1,

      yearId: "",
      yearData: [],
      // academicSessionsData: [],
      // academicSessionsDataLoading: false,
      // academicSessionId: "",
      // academicSessionIdError: "",

      openDialog: false,
      selectedStudent: null,

      programmeGroupsData: [],
      programmeGroupsDataLoading: false,
      programmeGroupId: "",

      attendanceSheetId: 0,
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
        // this.getProgrammeGroupsBySessionId(value);
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

  handleInputChange = (fieldName, value, rowData) => {
    const { id } = rowData;
    const updatedData = this.state.teachersAttendanceSheetData.map((item) =>
      item.id === id
        ? {
            ...item,
            [fieldName]: fieldName === "remarks" ? value : Number(value),
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
      { name: "userId", title: "ID" },
      {
        name: "userLabel",
        title: "Name",
        getCellValue: (rowData) => {
          return (
            <div
              style={{
                whiteSpace: "pre-line",
              }}
            >{`${rowData.userLabel}`}</div>
          );
        },
        customStyleHeader: { width: "100%", whiteSpace: "pre-line" },
      },
      {
        name: "reportingTo",
        title: "Reporting To",
        getCellValue: (rowData) => {
          return (
            <div
              style={{
                whiteSpace: "pre-line",
              }}
            >{`${rowData.reportingTo}`}</div>
          );
        },
        customStyleHeader: { width: "100%", whiteSpace: "pre-line" },
      },
      { name: "coordinatingTo", title: "Coordinating To" },
      // { name: "pendingForApprovalFrom", title: "Pending For Approval From" },

      // {
      //   name: "adjustedAbsentDays",
      //   title: "Days Deducted Due to Absence",
      //   // getCellValue: (rowData) => {
      //   //   return (
      //   //     <div
      //   //       style={{
      //   //         whiteSpace: "pre-line",
      //   //       }}
      //   //     >{`${rowData.displayName}`}</div>
      //   //   );
      //   // },
      //   // customStyleHeader: { width: "100%", whiteSpace: "pre-line" },
      // },

      // { name: "adjustedLateDays", title: "Days Deducted Due to Short Time" },
      // { name: "remarks", title: "Remarks" },
    ];

    console.log(this.state.teachersAttendanceSheetData);

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
              {"Employees Not Submitted Report for Payroll"}
              <br />
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <br />
          <Grid container justify="left" alignItems="left" spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                id="academicSessionId"
                name="academicSessionId"
                variant="outlined"
                onChange={this.onHandleChange}
                value={this.state.academicSessionId.session}
                fullWidth
                disabled

                // select
              >
                {/* {this.state.academicSessionsData?.map((item) => (
                  <MenuItem key={item} value={item.ID}>
                    {item.Label}
                  </MenuItem>
                ))} */}
              </TextField>
            </Grid>
            <br />
            <Grid item xs={12} md={3}>
              <TextField
                id="monthId"
                name="monthId"
                variant="outlined"
                onChange={this.onHandleChange}
                value={this?.state?.academicSessionId.sessionPayrollMonth}
                fullWidth
                disabled
              >
                {/* {this.state.yearData?.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item.monthName}
                  </MenuItem>
                ))} */}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Divider className={classes.divider} />
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            style={{
              marginBottom: "6%",
            }}
          >
            <MonthlyEmployeeLateDaysReportforPayrollTableComponent
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
        </div>
      </Fragment>
    );
  }
}

EmployeesNotSubmitted.propTypes = {
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

EmployeesNotSubmitted.defaultProps = {
  classes: {},
  setDrawerOpen: (fn) => fn,
};
export default withRouter(withStyles(styles)(EmployeesNotSubmitted));
