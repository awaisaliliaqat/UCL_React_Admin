import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import {
  Divider,
  CircularProgress,
  Grid,
  Button,
  Typography,
  TextField,
  MenuItem,
} from "@material-ui/core";
import F322HourlySheetsForCoordinatorsTableComponent from "./chunks/F322HourlySheetsForCoordinatorsTableComponent";
import { IsEmpty } from "../../../../../utils/helper";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import ViewTableRecord from "../../../../../components/EditDeleteTableRecord/ViewTableRecord";

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

class F322HourlySheetsForCoordinators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,

      isLoginMenu: false,
      isReload: false,

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      academicSessionsData: [],
      academicSessionsDataLoading: false,
      academicSessionId: "",
      academicSessionIdError: "",

      yearData: [],
      yearId: "",

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
    this.props.setDrawerOpen(false);
    this.getAcademicSessions();
  }

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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C322TeachersProgrammeGroupAttandance`;
    var data = new FormData();
    data.append("academicsSessionId", this.state.academicSessionId);
    data.append("programmeGroupId", this.state.programmeGroupId);
    data.append("month", this.state.monthId);
    data.append("year", this.state.yearId);

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
            let array = json.DATA || [];

            array = array.map((item) => {
              return {
                ...item,
                adjustedHours: 0,
                netHours: item.totalHours,
                adjustedRemarks: "",
              };
            });

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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C322TeachersProgrammeGroupAttandanceAprrovalSave`;
    // var data = new FormData();
    const groupedData = this.state.teachersAttendanceSheetData.reduce(
      (acc, current) => {
        const { teacherId, payRollId } = current;

        let teacher = acc.find(
          (item) => item.teacherId === teacherId && item.payRollId === payRollId
        );

        if (!teacher) {
          teacher = {
            teacherId,
            payRollId,
            payRollDetail: [],
          };
          acc.push(teacher);
        }

        const payRollDetail = {
          courseId: current.courseId,
          totalScheduled: current.totalSchedules,
          totalAttended: current.totalAttended,
          durationPerSession: current.durationPerSession,
          totalHours: current.totalHours,
          ratePerHour: current.ratePerHour,
          totalAmount: current.totalAmount,
          adjustedHours: Number(current.adjustedHours),
          netHoursAfterAdjustmentHours: Number(current.netHours),
          adjustmentRemarks: current.adjustedRemarks,
        };

        teacher.payRollDetail.push(payRollDetail);
        return acc;
      },
      []
    );

    const data = {
      academicsSessionId: this.state.academicSessionId,
      programmeGroupId: this.state.programmeGroupId,
      month: this.state.monthId,
      year: this.state.yearId,
      teachers: [...groupedData],
    };

    console.log(data, "data is coming");
    // data.append("academicsSessionId", this.state.academicSessionId);
    // data.append("programmeGroupId", this.state.programmeGroupId);
    // data.append("month", this.state.monthId);
    // for (let i = 0; i <= this.state.teachersAttendanceSheetData; i++) {
    //   data.append(
    //     "courseId",
    //     this.state.teachersAttendanceSheetData[i].courseId
    //   );
    //   data.append(
    //     "totalScheduled",
    //     this.state.teachersAttendanceSheetData[i].totalScheduled
    //   );
    //   data.append(
    //     "totalAttended",
    //     this.state.teachersAttendanceSheetData[i].totalAttended
    //   );
    //   data.append(
    //     "durationPerSession",
    //     this.state.teachersAttendanceSheetData[i].durationPerSession
    //   );
    //   data.append(
    //     "totalHours",
    //     this.state.teachersAttendanceSheetData[i].totalHours
    //   );
    //   data.append(
    //     "ratePerHour",
    //     this.state.teachersAttendanceSheetData[i].ratePerHour
    //   );
    //   data.append(
    //     "totalAmount",
    //     this.state.teachersAttendanceSheetData[i].totalAmount
    //   );
    //   data.append(
    //     "adjustedHours",
    //     this.state.teachersAttendanceSheetData[i].adjustedHours
    //   );
    //   data.append(
    //     "netHoursAfterAdjustmentHours",
    //     this.state.teachersAttendanceSheetData[i].netHours
    //   );
    //   data.append(
    //     "adjustmentRemarks",
    //     this.state.teachersAttendanceSheetData[i].adjustedRemarks
    //   );
    // }
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

    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  handleRatePerHourChange = (value, rowData) => {
    const { courseId } = rowData;
    const updatedData = this.state.teachersAttendanceSheetData.map((item) =>
      item.courseId === courseId
        ? {
            ...item,
            adjustedHours: value,
            netHours: (parseFloat(value) || 0) + item.totalHours,
          }
        : item
    );
    this.setState({
      teachersAttendanceSheetData: updatedData,
    });
  };
  handleAdjustedHourChange = (value, rowData) => {
    const { courseId } = rowData;
    const updatedData = this.state.teachersAttendanceSheetData.map((item) =>
      item.courseId === courseId
        ? {
            ...item,
            adjustedRemarks: value,
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

      // { name: "totalHours", title: "Adjustment Hours" },
      // { name: "totalHours", title: "Net Hours" },
      // { name: "totalHours", title: "Adjustment Remarks" },

      {
        name: "adjustedHours",
        title: "Adjusted Hours",
        getCellValue: (rowData) => {
          console.log(rowData);

          return (
            <TextField
              variant="outlined"
              size="small"
              name="adjustedHours"
              disabled={
                !this.state.academicSessionId ||
                !this.state.programmeGroupId ||
                !this.state.monthId ||
                this.state.teachersAttendanceSheetData?.length <= 0 ||
                this.state.isApproved
              }
              type="number"
              value={rowData.adjustedHours || ""}
              onChange={(event) =>
                this.handleRatePerHourChange(event.target.value, rowData)
              }
            />
          );
        },
      },

      { name: "netHours", title: "Net Hours" },
      {
        name: "adjustmentRemarks",
        title: "Adjusted Remarks",
        getCellValue: (rowData) => {
          return (
            <TextField
              variant="outlined"
              size="small"
              name="adjustedRemarks"
              disabled={
                !this.state.academicSessionId ||
                !this.state.programmeGroupId ||
                !this.state.monthId ||
                this.state.teachersAttendanceSheetData?.length <= 0 ||
                this.state.isApproved
              }
              type="text"
              value={rowData.adjustedRemarks || ""}
              onChange={(event) =>
                this.handleAdjustedHourChange(event.target.value, rowData)
              }
            />
          );
        },
      },

      // { name: "ratePerHour", title: "Rate Per Hour" },
      // { name: "totalAmount", title: "Total Amount" },
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
              {"Hourly Sheet For Coordinators"}
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
            <Grid item xs={12} md={2}>
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
            </Grid>
            <Grid item xs={12} md={2}>
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
            </Grid>
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
                {this.state.monthsData?.map((item) => (
                  <MenuItem key={item} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
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
                    this.state.programmeGroupsDataLoading ||
                    !this.state.academicSessionId ||
                    !this.state.programmeGroupId ||
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
            <F322HourlySheetsForCoordinatorsTableComponent
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
            left_button_hide={false}
            bottomLeftButtonAction={this.viewReport}
            right_button_text={
              this.state.isApproved ? "Approved" : "Send For Approval"
            }
            disableRightButton={
              !this.state.academicSessionId ||
              !this.state.programmeGroupId ||
              !this.state.monthId ||
              this.state.teachersAttendanceSheetData?.length <= 0 ||
              this.state.isApproved
            }
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            bottomRightButtonAction={() => this.onApproveClick()}
          />
        </div>
      </Fragment>
    );
  }
}

F322HourlySheetsForCoordinators.propTypes = {
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

F322HourlySheetsForCoordinators.defaultProps = {
  classes: {},
  setDrawerOpen: (fn) => fn,
};
export default withStyles(styles)(F322HourlySheetsForCoordinators);
