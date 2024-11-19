import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../../components/LoginMenu/LoginMenu";
import {
  TextField,
  Grid,
  Divider,
  Tooltip,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import CustomizedSnackbar from "../../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import F33FormInitials from "./F346FormInitials";
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
// import StudentAttendanceCalendarInitials from "./StudentAttendanceCalendarInitials";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import classNames from "clsx";
import QueuePlayNextOutlinedIcon from "@material-ui/icons/QueuePlayNextOutlined";
import { ClockFast } from "mdi-material-ui";

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

  customTimeCell: {
    height: "300px",
    // width: "200px",
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
  commandButton: {
    // Add any existing styling for the button here, if needed
  },
  classDetailsContainer: {
    marginTop: "10px",
  },
  classInfo: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
  },
  courseTitle: {
    fontWeight: "bold",
    marginRight: "20px",
  },
  classTime: {
    color: "#555",
    marginRight: "20px",
  },
  status: {
    fontWeight: "bold",
  },
});

const Header = withStyles(style, { name: "Header" })(
  ({ appointmentData, classes, ...restProps }) => {
    return (
      <AppointmentTooltip.Header
        {...restProps}
        appointmentData={appointmentData}
      ></AppointmentTooltip.Header>
    );
  }
);
const getStatusColor = (item) => {
  if (item.classStatus === "Held") {
    return "royalblue";
  } else {
    return "darkred";
  }
};

const Appointment = ({ children, style, ...restProps }) => {
  return (
    <Appointments.Appointment
      {...restProps}
      style={
        !restProps.data.checkIn
          ? {
              ...style,
              backgroundColor: "#FFA499",
              overflowY: "auto",
              scrollbarWidth: "thin",
            }
          : { ...style, overflowY: "auto", scrollbarWidth: "thin" }
      }
    >
      {/* {children} */}
      <div
        style={{
          color: "black",
          textAlign: "center",
          marginTop: "13px",
          // overFlowY: "auto",
        }}
      >
        {restProps.data.checkIn && <>Gate-in: {restProps.data.checkIn}</>}
        {/* Gate-in: {restProps.data.checkIn} */}
        <br />
        <div
          style={{
            color: "black",
            textAlign: "center",
            marginTop: "13px",
          }}
        >
          {/* Classes Detail: */}
          <br />
          {restProps.data.classesData.length !== 0 &&
            restProps?.data?.classesData?.map((item) => {
              console.log(item);
              return (
                <div>
                  {/* Classname:  */}

                  <span
                    style={{
                      color: getStatusColor(item),
                    }}
                  >
                    {item.courseTitle}
                    {item.virtualClass === 1 && "(Virtual)"}
                    <br />
                    {item.classTime} -{" "}
                    {item.studentStatus === "Absent" ? (
                      <span
                        style={{
                          color: "orangered",
                        }}
                      >
                        {item.studentStatus}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "black",
                        }}
                      >
                        {item.studentStatus}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
        </div>
        {restProps.data.checkOut && (
          <div
            style={{
              marginTop: "5%",
            }}
          >
            Gate-out: {restProps.data.checkOut}
          </div>
        )}
      </div>
    </Appointments.Appointment>
  );
};

class StudentAttendanceCalendar extends Component {
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
      studentName: "",
      NucleusID: "",
      monthEnum: null,
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

  convertToTargetFormat = (dataArray) => {
    return dataArray.map((item, index) => {
      const startDate = new Date(item.date);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      if (
        item.checkIn !== "" ||
        item.checkOut !== "" ||
        item.Classes.length !== 0
      ) {
        return {
          checkIn: item.checkIn,
          checkOut: item.checkOut,
          classesData: item.Classes,
          endDate: endDate,
          id: item.nucluesId || index,
          title: `${item.studentName} - ${item.programmeLabel} (${item.label} ${item.checkIn} - ${item.checkOut})`,
          courseId: item.courseId || 0,
          startDate: item.date,
        };
      } else {
        return {};
      }
    });
  };

  loadTimeTableData = async (nucleusID, monthEnum) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C346StudentAttendanceFeatureDetailView?nucleusId=${nucleusID}&month=${monthEnum}`;
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
            // const updatedData = this.convertToTargetFormat(json.DATA);
            // console.log(updatedData);
            // this.setState({ timeTableDataArray: json.DATA });
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
          const updatedData = this.convertToTargetFormat(json.DATA);

          this.setState({
            timeTableDataArray: updatedData,
            studentName: json.DATA[0].studentName,
            NucleusID: json.DATA[0].nucluesId,
            // monthEnum: monthEnum,
          });
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

  componentDidMount() {
    this.props.setDrawerOpen(false);
    const data = this.props.match.params.id;

    const nucleusID = data.split("T")[0];
    const monthEnum = data.split("T")[1];

    this.setMonthEnum(monthEnum);

    this.loadTimeTableData(nucleusID, monthEnum);
  }

  setMonthEnum = (backendDate) => {
    const [monthName, year] = backendDate.split(" ");
    const monthIndex = new Date(Date.parse(`${monthName} 1`)).getMonth();
    const selectedDate = new Date(year, monthIndex, 1);

    this.setState({ monthEnum: selectedDate });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
      } else {
        window.location.reload();
      }
    }
  }

  // Custom Time Table Cell Component
  CustomTimeTableCell = withStyles(styles)(({ classes, ...restProps }) => (
    <MonthView.TimeTableCell
      {...restProps}
      className={classes.customTimeCell}
    />
  ));

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />

        <Divider
          style={{
            backgroundColor: "rgb(58, 127, 187)",
            opacity: "0.3",
            marginBottom: 20,
          }}
        />
        <Typography
          style={{
            color: "#1d5f98",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
          variant="h6"
        >
          Nucleus ID : {this.state?.NucleusID}
        </Typography>
        <Typography
          style={{
            color: "#1d5f98",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
          variant="h6"
        >
          Student Name : {this.state?.studentName}
        </Typography>
        <Divider
          style={{
            backgroundColor: "rgb(58, 127, 187)",
            opacity: "0.3",
            marginBottom: 20,
          }}
        />
        <form id="myForm" onSubmit={this.isFormValid}>
          <TextField type="hidden" name="id" value={this.state.recordId} />
          <Grid container component="main" className={classes.root} spacing={2}>
            <Grid item sm={12} md={8} lg={9}>
              {this.state.timeTableDataArray.length !== 0 ? (
                <Paper>
                  <Scheduler data={this.state.timeTableDataArray}>
                    <ViewState currentDate={new Date(this.state.monthEnum)} />
                    <MonthView
                      timeTableCellComponent={this.CustomTimeTableCell}
                    />
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
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </div>
              )}
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
export default withStyles(styles)(StudentAttendanceCalendar);
