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
import F323HourlySheetsForHeadsTableComponent from "./chunks/F326ConsolidatedSheetsForDirectorTableComponent";
import { IsEmpty } from "../../../../../utils/helper";

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

class F323HourlySheetsForHeads extends Component {
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

  getAcademicSessions = async () => {
    this.setState({ academicSessionsDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C326CommonAcademicSessionsView`;
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
  //   const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C326CommonAcademicsProgrammesGroupsView`;
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

    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C326EmployeeHourlySheetApprovedView`;
    var data = new FormData();
    data.append("academicsSessionId", this.state.academicSessionId);
    // data.append("programmeGroupId", this.state.programmeGroupId);
    // data.append("month", this.state.monthId);
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

            let myExpandedGroupsData = [];
            for (let i = 0; i < array.length; i++) {
              myExpandedGroupsData.push(array[i]["monthLabel"]);
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

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
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

    // this.getProgrammeGroupsBySessionId(sessionId);

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

    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  render() {
    const { classes } = this.props;

    const columns = [
      { name: "monthLabel", title: "Month" },
      { name: "teacherLabel", title: "Teacher Name" },
      { name: "courseLabel", title: "Subjects" },
      { name: "programmeGroupLabel", title: "Programme Group" },
      { name: "totalSchedules", title: "Total" },
      { name: "totalAttended", title: "Attended" },
      { name: "durationPerSession", title: "Duration Per Session" },
      { name: "totalHours", title: "Total Hours" },
      { name: "totalAdjustedHours", title: "Adjusted Hours" },
      { name: "adjustmentRemarks", title: "Adjustment Remarks" },
      { name: "totalNetHours", title: "Net Hours" },
      { name: "ratePerHour", title: "Rate Per Hour" },
      { name: "totalAmount", title: "Total Amount" },
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
              {"Consolidated Hourly Sheet For Director"}
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
            {/* <Grid item xs={12} md={3}>
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
                fullWidth
                select
              >
                {this.state.monthsData?.map((item) => (
                  <MenuItem key={item} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}
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
                    !this.state.academicSessionId
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
            <F323HourlySheetsForHeadsTableComponent
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

F323HourlySheetsForHeads.propTypes = {
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

F323HourlySheetsForHeads.defaultProps = {
  classes: {},
  setDrawerOpen: (fn) => fn,
};
export default withStyles(styles)(F323HourlySheetsForHeads);
