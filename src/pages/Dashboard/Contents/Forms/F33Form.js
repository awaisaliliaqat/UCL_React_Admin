import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, Divider, Tooltip } from "@material-ui/core";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Paper from "@material-ui/core/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  MonthView,
  Appointments,
  Toolbar,
  DateNavigator,
  TodayButton,
  AppointmentTooltip,
  EditRecurrenceMenu,
  CurrentTimeIndicator,
} from "@devexpress/dx-react-scheduler-material-ui";
import F33FormInitials from "./F33FormInitials";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import classNames from "clsx";
import QueuePlayNextOutlinedIcon from "@material-ui/icons/QueuePlayNextOutlined";

const style = ({ palette }) => ({
  icon: {
    color: palette.action.active,
  },
  textCenter: {
    textAlign: "center",
  },
  header: {
    height: "260px",
    backgroundSize: "cover",
  },
  commandButton: {
    backgroundColor: "rgba(255,255,255,0.65)",
  },
});

const styles = () => ({
  root: {
    padding: 20,
    minWidth: 350,
    overFlowX: "auto",
  },
  formControl: {
    minWidth: "100%",
  },
  sectionTitle: {
    fontSize: 19,
    color: "#174a84",
  },
  checkboxDividerLabel: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 20,
    fontSize: 16,
    fontWeight: 600,
  },
  rootProgress: {
    width: "100%",
    textAlign: "center",
  },
});

const Header = withStyles(style, { name: "Header" })(
  ({ children, appointmentData, classes, ...restProps }) => (
    <AppointmentTooltip.Header {...restProps} appointmentData={appointmentData}>
      {appointmentData.meetingStartUrl && (
        <Tooltip title="Join">
          <IconButton
            //onClick={() => alert(JSON.stringify(appointmentData))}
            onClick={(e) => this.onJoinClick(e, appointmentData)}
            className={classes.commandButton}
          >
            <QueuePlayNextOutlinedIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}
    </AppointmentTooltip.Header>
  )
);

const Appointment = ({ children, style, ...restProps }) => {
  console.log(restProps.data);
  return (
    <Appointments.Appointment
      {...restProps}
      style={
        restProps.data.isCanceled
          ? { ...style, backgroundColor: "#f5594e" }
          : { ...style }
      }
    >
      {children}
    </Appointments.Appointment>
  );
};

class F33Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      timeTableDataArray: [],
      upcomingClassesDataArray: [],
    };
  }

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      isOpenSnackbar: false,
    });
  };

  loadTimeTableData = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C33CommonAcademicsTimeTableView`;
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
            this.setState({ timeTableDataArray: json.DATA });
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("loadTimeTableData", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadUpcomingClassesData = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C33CommonAcademicsTimeTableUpcomingClassesView`;
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
            this.setState({ upcomingClassesDataArray: json.DATA });
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("loadUpcomingClassesData", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  clickOnFormSubmit = () => {
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    if (!this.isAcademicSessionValid() || !this.isProgrammeValid()) {
      return;
    }

    let effectiveDate = document.getElementById("effectiveDate").value;
    let sectionId = document.getElementById("sectionId").value;
    let dayId = document.getElementsByName("dayId");
    let startTime = document.getElementsByName("startTime");
    let duration = document.getElementsByName("duration");

    let myForm = document.getElementById("myForm");
    let data = new FormData(myForm);

    data.append("effectiveDate", effectiveDate);
    data.append("sectionId", sectionId);
    if (dayId != null) {
      for (let i = 0; i < dayId.length; i++) {
        data.append("dayId", dayId[i].value);
        data.append("startTime", startTime[i].value);
        data.append("duration", duration[i].value);
      }
    }

    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C31CommonAcademicsScheduleSave`;
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
            this.handleOpenSnackbar(json.USER_MESSAGE, "success");
            setTimeout(() => {
              if (this.state.recordId != 0) {
                window.location = "#/dashboard/F09Reports";
              } else {
                window.location.reload();
              }
            }, 2000);
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  onJoinClick = async (e, data = {}) => {
    e.preventDefault();
    this.setState({
      isLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/lms/C33CommonAcademicsAttendanceTeachersLogSave?classId=${
      data.id
    }&typeId=${1}`;
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
            window.open(data.meetingStartUrl, "_blank");
          } else {
            if (json.CODE === 1) {
              let data = json.DATA || [];
              this.setState({ timeTableDataArray: data });
            } else {
              this.handleOpenSnackbar(
                <span>
                  {json.SYSTEM_MESSAGE}
                  <br />
                  {json.USER_MESSAGE}
                </span>,
                "error"
              );
            }
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            alert("Operation Faild ! Please try again");
          }
        }
      );
    this.setState({
      isLoading: false,
    });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadTimeTableData();
    this.loadUpcomingClassesData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
      } else {
        window.location.reload();
      }
    }
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
        <form id="myForm" onSubmit={this.isFormValid}>
          <TextField type="hidden" name="id" value={this.state.recordId} />
          <Grid container component="main" className={classes.root} spacing={2}>
            <Grid item sm={12} md={8} lg={9}>
              <Paper>
                <Scheduler data={this.state.timeTableDataArray}>
                  <ViewState defaultCurrentDate={new Date()} />
                  <MonthView />
                  <Appointments appointmentComponent={Appointment} />
                  <EditingState />
                  <EditRecurrenceMenu title="title" />
                  <AppointmentTooltip
                    showCloseButton
                    headerComponent={Header}
                  />
                  <Toolbar />
                  <DateNavigator />
                  <TodayButton />
                  <CurrentTimeIndicator
                    shadePreviousCells={true}
                    shadePreviousAppointments={true}
                    updateInterval={10000}
                  />
                </Scheduler>
              </Paper>
            </Grid>
            <Grid item sm={12} md={4} lg={3}>
              <F33FormInitials
                data={this.state.upcomingClassesDataArray}
                isLoading={this.state.isLoading}
                onJoinClick={(e, data) => this.onJoinClick(e, data)}
              />
            </Grid>
          </Grid>
        </form>
        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleCloseSnackbar()}
        />
      </Fragment>
    );
  }
}
export default withStyles(styles)(F33Form);
