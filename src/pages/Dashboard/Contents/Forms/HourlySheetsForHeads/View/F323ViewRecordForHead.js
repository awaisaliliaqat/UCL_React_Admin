import React, { Component, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../../components/LoginMenu/LoginMenu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

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
} from "@material-ui/core";
import F323ViewRecordForHeadsTableComponent from "./chunks/F323ViewRecordForHeadTableComponent";
import { IsEmpty } from "../../../../../../utils/helper";
import BottomBar from "../../../../../../components/BottomBar/BottomBar";
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

class F323ViewRecordForHeads extends Component {
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

      teachersAttendanceSheetData: [],

      isApproved: false,
    };
  }
  componentDidMount() {
    const { recordId } = this.props.match.params;

    // this.props.setDrawerOpen(false);
    // this.getAcademicSessions();

    this.setState({ recordId: recordId }, () => {
      this.onSearchClick();
    });
  }

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
    var data = new FormData();
    data.append("recordId", this.state.recordId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C323EmployeeHourlySheetApprovedView`;
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
            let array = json.DATA[0].detail || [];

            let myExpandedGroupsData = [];
            for (let i = 0; i < array.length; i++) {
              myExpandedGroupsData.push(array[i]["teacherLabel"]);
            }

            let isApproved = false;
            if (array.length > 0) {
              isApproved = array[0]["isApproved"] || false;
            }

            this.setState({
              teachersAttendanceSheetData: array,
              expandedGroupsData: myExpandedGroupsData,
              academicSessionId: json.DATA[0].sessionLabel,
              programmeGroupId: json.DATA[0].programmeGroupLabel,
              monthId: json.DATA[0].monthLabel,
              isApprovedByHead: json.DATA[0].isApproved,
              yearId: json.DATA[0].year,
              isApproved,
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C323TeachersProgrammeGroupAttandanceAprrovalSave`;
    // var data = new FormData();
    const { teachersAttendanceSheetData } = this.state;

    const groupedData = teachersAttendanceSheetData.reduce((acc, current) => {
      const { hourlySheetEmployeesId } = current;

      let employee = acc.find(
        (item) => item.hourlySheetEmployeesId === hourlySheetEmployeesId
      );

      if (!employee) {
        employee = {
          hourlySheetEmployeesId,
          hourlySheetEmployeesCourses: [],
        };
        acc.push(employee);
      }

      const courseDetail = {
        hourlySheetEmployeesCourseId: current.hourlySheetEmployeesCourseId,
        totalAdjustedHours: current.totalAdjustedHours,
        totalNetHours: current.totalNetHours,
        totalAmount: current.totalAmount,
        adjustmentRemarks: current.adjustmentRemarks || "",
      };

      employee.hourlySheetEmployeesCourses.push(courseDetail);

      return acc;
    }, []);

    const data = {
      hourlySheetId: this.state.recordId,
      hourlyEmployees: groupedData,
    };

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

    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  handleRatePerHourChange = (value, rowData) => {
    const { teacherId, courseId } = rowData;
    console.log(rowData);
    const updatedData = this.state.teachersAttendanceSheetData.map((item) =>
      item.teacherId === teacherId && item.courseId === courseId
        ? {
            ...item,
            totalAdjustedHours: value,
            totalNetHours: (parseFloat(value) || 0) + item.totalHours,
            totalAmount:
              ((parseFloat(value) || 0) + item.totalHours) * item.ratePerHour,
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
      { name: "teacherLabel", title: "Teacher Name" },
      { name: "courseLabel", title: "Subjects" },
      { name: "totalSchedules", title: "Total" },
      { name: "totalAttended", title: "Attended" },
      { name: "durationPerSession", title: "Duration Per Session" },
      { name: "totalHours", title: "Total Hours" },
      {
        name: "totalAdjustedHours",
        title: "Adjusted Hours",
        getCellValue: (rowData) => {
          return (
            <TextField
              variant="outlined"
              size="small"
              name="adjustedHours"
              disabled={
                !this.state.academicSessionId ||
                !this.state.programmeGroupId ||
                // !this.state.monthId ||
                this.state.teachersAttendanceSheetData?.length <= 0 ||
                this.state.isApproved
              }
              type="number"
              value={rowData.totalAdjustedHours || ""}
              onChange={(event) =>
                this.handleRatePerHourChange(event.target.value, rowData)
              }
            />
          );
        },
      },
      { name: "totalNetHours", title: "Net Hours" },
      { name: "ratePerHour", title: "Rate Per Hour" },
      { name: "totalAmount", title: "Total Amount" },
      { name: "adjustmentRemarks", title: "Adjustment Remarks" },
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
              <Tooltip title="Back">
                <IconButton onClick={() => window.history.back()}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              {"Hourly Sheet For Director"}
              <br />
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <br />
          <Grid container justifyContent="left" alignItems="left" spacing={2}>
            <Grid item xs={12} md={3}>
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
                InputProps={{
                  classes: { disabled: classes.disabledTextField },
                }}
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
                id="programmeGroupId"
                name="programmeGroupId"
                variant="outlined"
                label="Programme Group"
                onChange={this.onHandleChange}
                value={this.state.programmeGroupId}
                error={!!this.state.programmeGroupIdError}
                helperText={this.state.programmeGroupIdError}
                required
                InputProps={{
                  classes: { disabled: classes.disabledTextField },
                }}
                disabled
                fullWidth
                // select
              >
                {/* {this.state.programmeGroupsData?.map((item) => (
                  <MenuItem key={item} value={item.Id}>
                    {item.Label}
                  </MenuItem>
                ))} */}
              </TextField>
            </Grid>
            {/* <Grid item xs={12} md={3}>
              <TextField
                id="yearId"
                name="yearId"
                variant="outlined"
                label="Year"
                onChange={this.onHandleChange}
                value={this.state.yearId}
                // error={!!this.state.programmeGroupIdError}
                // helperText={this.state.programmeGroupIdError}
                required
                InputProps={{
                  classes: { disabled: classes.disabledTextField },
                }}
                disabled
                fullWidth
                // select
              >
              {this.state.programmeGroupsData?.map((item) => (
                  <MenuItem key={item} value={item.Id}>
                    {item.Label}
                  </MenuItem>
                ))} 
              </TextField>
            </Grid> */}
            <Grid item xs={12} md={3}>
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
                InputProps={{
                  classes: { disabled: classes.disabledTextField },
                }}
                disabled
                fullWidth
                // select
              >
                {/* {this.state.monthsData?.map((item) => (
                  <MenuItem key={item} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))} */}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Divider className={classes.divider} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <F323ViewRecordForHeadsTableComponent
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
            leftButtonHide
            // leftButtonText="View"
            // leftButtonHide={false}
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

F323ViewRecordForHeads.propTypes = {
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

F323ViewRecordForHeads.defaultProps = {
  classes: {},
  setDrawerOpen: (fn) => fn,
};
export default withRouter(withStyles(styles)(F323ViewRecordForHeads));
