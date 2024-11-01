import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  Divider,
  CardActions,
  Typography,
  Avatar,
  CardContent,
  List,
  Badge,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  withStyles,
  Tooltip,
  Button,
  ListItemSecondaryAction,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import HelpIcon from "../../../../assets/Images/workflows.png";
import CreateIcon from "@material-ui/icons/Create";
import NotificationsIcon from "@material-ui/icons/Notifications";
//import ProfilePlaceHolder from '../../../../assets/Images/ProfilePlaceholder.png';
import ProfilePlaceHolder from "../../../../assets/Images/my_objectives_training.png";
import ScheduleIcon from "@material-ui/icons/Schedule";
import BookAssignments from "../../../../assets/Images/grade_book_assignments.png";

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(2),
  },

  extendedIcon: {
    marginRight: theme.spacing(2),
  },

  smallAvatar: {
    width: 30,
    height: 30,
    marginTop: 5,
    borderRadius: 0,
  },

  bigAvatar: {
    width: 40,
    height: 40,
    marginTop: 5,
    borderRadius: 0,
  },

  card: {
    //cursor: "pointer"
  },
});

const F344MonthlyAttendanceFeatureInitials = (props) => {
  const { classes, data, isLoading } = props;

  return (
    <Card
      //onClick={() => window.open('#/dashboard/calendar')}
      //title="View Time Table"
      className={classes.card}
    >
      <CardHeader
        title={<Typography color="primary">Classes</Typography>}
        subheader={"Join your virtual classes"}
        avatar={
          <Avatar className={classes.bigAvatar} src={ProfilePlaceHolder} />
        }
      />
      <CardContent
      // style={{
      //   height: '210px'
      // }}
      >
        <List
          style={{
            marginTop: "-30px",
          }}
        >
          {data.length > 0
            ? data.map((dt, i) => (
                <Fragment key={i}>
                  <ListItem style={{ paddingTop: 0 }} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Img"
                        src={BookAssignments}
                        className={classes.smallAvatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          component="legend"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {dt.sectionLabel}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            variant="caption"
                            style={{ paddingLeft: "2px" }}
                          >
                            {dt.startTime}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <ListItemSecondaryAction style={{ right: 0 }}>
                      <Button
                        onClick={(e) => props.onJoinClick(e, dt)}
                        color="primary"
                        disabled={!dt.meetingStartUrl}
                      >
                        Join
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Fragment>
              ))
            : isLoading && (
                <Grid container justify="center">
                  <CircularProgress />
                </Grid>
              )}

          {/* 
          <ListItem style={{ paddingTop: 0 }} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={ProfilePlaceHolder}
                className={classes.smallAvatar}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  component="legend"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Physics
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    9:00 am
                  </Typography>
                </React.Fragment>
              }
            />
            <ListItemSecondaryAction style={{ right: 0 }}>
              <Button disabled color="primary">
                Join
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem style={{ paddingTop: 0 }} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt="img"
                src={ProfilePlaceHolder}
                className={classes.smallAvatar}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  component="legend"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Fundamentals of Programming
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    variant="caption"

                    style={{ paddingLeft: "2px" }}
                  >
                    10:00 am
                  </Typography>
                </React.Fragment>
              }
            />
            <ListItemSecondaryAction style={{ right: 0 }}>
              <Button disabled color="primary">
                Join
              </Button>
            </ListItemSecondaryAction>
          </ListItem> 
          */}
        </List>
      </CardContent>
      <Divider variant="middle" />
      <CardActions style={{ textAlign: "center" }} className={classes.actions}>
        <div>
          <Tooltip title="View">
            {/* <Link 
              style={{ textDecoration: 'none' }} 
              to="/dashboard/calendar" 
              target="_blank"
            > */}
            <IconButton aria-label="View">
              <CreateIcon />
            </IconButton>
            {/* </Link> */}
          </Tooltip>
          <Tooltip title="In Progress">
            <IconButton aria-label="In Progress">
              <Badge color="primary" badgeContent={4}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Action Awaited">
            <IconButton aria-label="Action Awaited">
              <Badge color="primary" badgeContent={4}>
                <ScheduleIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </div>
      </CardActions>
    </Card>
  );
};

F344MonthlyAttendanceFeatureInitials.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(F344MonthlyAttendanceFeatureInitials);

// import React, { Component, Fragment } from "react";
// import { withStyles } from "@material-ui/styles";
// import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
// import {
//   TextField,
//   Grid,
//   Divider,
//   Tooltip,
//   Typography,
// } from "@material-ui/core";
// import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
// import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
// import Paper from "@material-ui/core/Paper";
// import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
// import {
//   Scheduler,
//   DayView,
//   MonthView,
//   Appointments,
//   Toolbar,
//   DateNavigator,
//   TodayButton,
//   AppointmentTooltip,
//   EditRecurrenceMenu,
//   CurrentTimeIndicator,
// } from "@devexpress/dx-react-scheduler-material-ui";
// import F344MonthlyAttendanceFeatureInitials from "./F344MonthlyAttendanceFeatureInitials";
// import IconButton from "@material-ui/core/IconButton";
// import MoreIcon from "@material-ui/icons/MoreVert";
// import classNames from "clsx";
// import QueuePlayNextOutlinedIcon from "@material-ui/icons/QueuePlayNextOutlined";

// const style = ({ palette }) => ({
//   icon: {
//     color: palette.action.active,
//   },
//   textCenter: {
//     textAlign: "center",
//   },
//   header: {
//     height: "260px",
//     backgroundSize: "cover",
//   },
//   commandButton: {
//     backgroundColor: "rgba(255,255,255,0.65)",
//   },
// });

// const styles = () => ({
//   root: {
//     padding: 20,
//     minWidth: 350,
//     overFlowX: "auto",
//   },
//   formControl: {
//     minWidth: "100%",
//   },
//   sectionTitle: {
//     fontSize: 19,
//     color: "#174a84",
//   },
//   checkboxDividerLabel: {
//     marginTop: 10,
//     marginLeft: 5,
//     marginRight: 20,
//     fontSize: 16,
//     fontWeight: 600,
//   },
//   rootProgress: {
//     width: "100%",
//     textAlign: "center",
//   },
// });

// const Header = withStyles(styles, { name: "Header" })(
//   ({ appointmentData, classes, ...restProps }) => (
//     <AppointmentTooltip.Header {...restProps} appointmentData={appointmentData}>
//       <div>
//         <Typography variant="h6" className={classes.studentName}>
//           {appointmentData.studentName}
//         </Typography>
//         <Typography variant="body2" className={classes.courseTitle}>
//           {appointmentData.courseTitle}
//         </Typography>
//         {appointmentData.isCanceled ? (
//           <Tooltip title="Canceled Class">
//             <CancelOutlinedIcon className={classes.canceledIcon} />
//           </Tooltip>
//         ) : (
//           appointmentData.meetingStartUrl && (
//             <Tooltip title="Join">
//               <IconButton
//                 onClick={() =>
//                   window.open(appointmentData.meetingStartUrl, "_blank")
//                 }
//                 className={classes.commandButton}
//               >
//                 <QueuePlayNextOutlinedIcon color="primary" />
//               </IconButton>
//             </Tooltip>
//           )
//         )}
//       </div>
//     </AppointmentTooltip.Header>
//   )
// );

// const Appointment = ({ children, style, ...restProps }) => (
//   <Appointments.Appointment
//     {...restProps}
//     style={
//       restProps.data.isCanceled
//         ? { ...style, backgroundColor: "#f5594e", color: "#fff" }
//         : { ...style, backgroundColor: "#81c784" }
//     }
//   >
//     {children}
//   </Appointments.Appointment>
// );

// class F344MonthlyAttendanceFeature extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       recordId: this.props.match.params.recordId,
//       isLoading: false,
//       isReload: false,
//       isOpenSnackbar: false,
//       snackbarMessage: "",
//       snackbarSeverity: "",
//       timeTableDataArray: [
//         {
//           studentId: 1001,
//           studentName: "John Doe",
//           checkIn: 1729747800000,
//           checkOut: 1729753200000,
//           isCanceled: 0,
//           courseId: 67,
//           courseTitle: "ST104b - Statistics 2 (10:30 AM - 12:00 PM)",
//         },
//         {
//           studentId: 1002,
//           studentName: "Jane Smith",
//           checkIn: 1729758600000,
//           checkOut: 1729764000000,
//           isCanceled: 0,
//           courseId: 52,
//           courseTitle: "st104a - Statistics 1 (01:30 PM - 03:00 PM)",
//         },
//         {
//           studentId: 1003,
//           studentName: "Alice Johnson",
//           checkIn: 1729839600000,
//           checkOut: 1729843200000,
//           isCanceled: 0,
//           courseId: 52,
//           courseTitle: "st104a - Statistics 1 (12:00 PM - 01:00 PM)",
//         },
//         {
//           studentId: 1004,
//           studentName: "Bob Williams",
//           checkIn: 1730093400000,
//           checkOut: 1730098800000,
//           isCanceled: 0,
//           courseId: 52,
//           courseTitle: "st104a - Statistics 1 (10:30 AM - 12:00 PM)",
//         },
//         {
//           studentId: 1005,
//           studentName: "Chris Brown",
//           checkIn: 1730098800000,
//           checkOut: 1730104200000,
//           isCanceled: 0,
//           courseId: 67,
//           courseTitle: "ST104b - Statistics 2 (12:00 PM - 01:30 PM)",
//         },
//         {
//           studentId: 1006,
//           studentName: "Emily Davis",
//           checkIn: 1730352600000,
//           checkOut: 1730358000000,
//           isCanceled: 0,
//           courseId: 67,
//           courseTitle: "ST104b - Statistics 2 (10:30 AM - 12:00 PM)",
//         },
//         {
//           studentId: 1007,
//           studentName: "David Johnson",
//           checkIn: 1730363400000,
//           checkOut: 1730368800000,
//           isCanceled: 0,
//           courseId: 52,
//           courseTitle: "st104a - Statistics 1 (01:30 PM - 03:00 PM)",
//         },
//         {
//           studentId: 1008,
//           studentName: "Samantha Clark",
//           checkIn: 1730444400000,
//           checkOut: 1730448000000,
//           isCanceled: 0,
//           courseId: 52,
//           courseTitle: "st104a - Statistics 1 (12:00 PM - 01:00 PM)",
//         },
//         {
//           studentId: 1009,
//           studentName: "Michael Miller",
//           checkIn: 1730698200000,
//           checkOut: 1730703600000,
//           isCanceled: 0,
//           courseId: 52,
//           courseTitle: "st104a - Statistics 1 (10:30 AM - 12:00 PM)",
//         },
//         {
//           studentId: 1010,
//           studentName: "Olivia Anderson",
//           checkIn: 1730703600000,
//           checkOut: 1730709000000,
//           isCanceled: 0,
//           courseId: 67,
//           courseTitle: "ST104b - Statistics 2 (12:00 PM - 01:30 PM)",
//         },
//       ],
//       upcomingClassesDataArray: [],
//     };
//   }

//   handleOpenSnackbar = (msg, severity) => {
//     this.setState({
//       isOpenSnackbar: true,
//       snackbarMessage: msg,
//       snackbarSeverity: severity,
//     });
//   };

//   handleCloseSnackbar = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     this.setState({
//       isOpenSnackbar: false,
//     });
//   };

//   loadTimeTableData = async () => {
//     this.setState({ isLoading: true });
//     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C33CommonAcademicsTimeTableView`;
//     await fetch(url, {
//       method: "POST",
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then(
//         (json) => {
//           if (json.CODE === 1) {
//             console.log(json.DATA, "data is coming");
//             this.setState({ timeTableDataArray: json.DATA });
//           } else {
//             this.handleOpenSnackbar(
//               <span>
//                 {json.SYSTEM_MESSAGE}
//                 <br />
//                 {json.USER_MESSAGE}
//               </span>,
//               "error"
//             );
//           }
//           console.log("loadTimeTableData", json);
//         },
//         (error) => {
//           if (error.status == 401) {
//             this.setState({
//               isLoginMenu: true,
//               isReload: true,
//             });
//           } else {
//             console.log(error);
//             this.handleOpenSnackbar(
//               "Failed to fetch ! Please try Again later.",
//               "error"
//             );
//           }
//         }
//       );
//     this.setState({ isLoading: false });
//   };

//   loadUpcomingClassesData = async () => {
//     this.setState({ isLoading: true });
//     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C33CommonAcademicsTimeTableUpcomingClassesView`;
//     await fetch(url, {
//       method: "POST",
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then(
//         (json) => {
//           if (json.CODE === 1) {
//             this.setState({ upcomingClassesDataArray: json.DATA });
//           } else {
//             this.handleOpenSnackbar(
//               <span>
//                 {json.SYSTEM_MESSAGE}
//                 <br />
//                 {json.USER_MESSAGE}
//               </span>,
//               "error"
//             );
//           }
//           console.log("loadUpcomingClassesData", json);
//         },
//         (error) => {
//           if (error.status == 401) {
//             this.setState({
//               isLoginMenu: true,
//               isReload: true,
//             });
//           } else {
//             console.log(error);
//             this.handleOpenSnackbar(
//               "Failed to fetch ! Please try Again later.",
//               "error"
//             );
//           }
//         }
//       );
//     this.setState({ isLoading: false });
//   };

//   clickOnFormSubmit = () => {
//     this.onFormSubmit();
//   };

//   onFormSubmit = async (e) => {
//     if (!this.isAcademicSessionValid() || !this.isProgrammeValid()) {
//       return;
//     }

//     let effectiveDate = document.getElementById("effectiveDate").value;
//     let sectionId = document.getElementById("sectionId").value;
//     let dayId = document.getElementsByName("dayId");
//     let startTime = document.getElementsByName("startTime");
//     let duration = document.getElementsByName("duration");

//     let myForm = document.getElementById("myForm");
//     let data = new FormData(myForm);

//     data.append("effectiveDate", effectiveDate);
//     data.append("sectionId", sectionId);
//     if (dayId != null) {
//       for (let i = 0; i < dayId.length; i++) {
//         data.append("dayId", dayId[i].value);
//         data.append("startTime", startTime[i].value);
//         data.append("duration", duration[i].value);
//       }
//     }

//     this.setState({ isLoading: true });
//     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C31CommonAcademicsScheduleSave`;
//     await fetch(url, {
//       method: "POST",
//       body: data,
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then(
//         (json) => {
//           if (json.CODE === 1) {
//             this.handleOpenSnackbar(json.USER_MESSAGE, "success");
//             setTimeout(() => {
//               if (this.state.recordId != 0) {
//                 window.location = "#/dashboard/F09Reports";
//               } else {
//                 window.location.reload();
//               }
//             }, 2000);
//           } else {
//             this.handleOpenSnackbar(
//               json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
//               "error"
//             );
//           }
//           console.log(json);
//         },
//         (error) => {
//           if (error.status == 401) {
//             this.setState({
//               isLoginMenu: true,
//               isReload: false,
//             });
//           } else {
//             console.log(error);
//             this.handleOpenSnackbar(
//               "Failed to Save ! Please try Again later.",
//               "error"
//             );
//           }
//         }
//       );
//     this.setState({ isLoading: false });
//   };

//   onJoinClick = async (e, data = {}) => {
//     e.preventDefault();
//     this.setState({
//       isLoading: true,
//     });
//     const url = `${process.env.REACT_APP_API_DOMAIN}/${
//       process.env.REACT_APP_SUB_API_NAME
//     }/lms/C33CommonAcademicsAttendanceTeachersLogSave?classId=${
//       data.id
//     }&typeId=${1}`;
//     await fetch(url, {
//       method: "POST",
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then(
//         (json) => {
//           if (json.CODE === 1) {
//             window.open(data.meetingStartUrl, "_blank");
//           } else {
//             if (json.CODE === 1) {
//               let data = json.DATA || [];
//               this.setState({ timeTableDataArray: data });
//             } else {
//               this.handleOpenSnackbar(
//                 <span>
//                   {json.SYSTEM_MESSAGE}
//                   <br />
//                   {json.USER_MESSAGE}
//                 </span>,
//                 "error"
//               );
//             }
//           }
//         },
//         (error) => {
//           if (error.status === 401) {
//             this.setState({
//               isLoginMenu: true,
//               isReload: false,
//             });
//           } else {
//             alert("Operation Faild ! Please try again");
//           }
//         }
//       );
//     this.setState({
//       isLoading: false,
//     });
//   };

//   componentDidMount() {
//     this.props.setDrawerOpen(false);
//     // this.loadTimeTableData();
//     // this.loadUpcomingClassesData();
//   }

//   componentWillReceiveProps(nextProps) {
//     if (this.props.match.params.recordId != nextProps.match.params.recordId) {
//       if (nextProps.match.params.recordId != 0) {
//         this.props.setDrawerOpen(false);
//       } else {
//         window.location.reload();
//       }
//     }
//   }

//   render() {
//     const { classes } = this.props;

//     return (
//       <Fragment>
//         <LoginMenu
//           reload={this.state.isReload}
//           open={this.state.isLoginMenu}
//           handleClose={() => this.setState({ isLoginMenu: false })}
//         />
//         <form id="myForm" onSubmit={this.isFormValid}>
//           <TextField type="hidden" name="id" value={this.state.recordId} />
//           <Grid container component="main" className={classes.root} spacing={2}>
//             <Grid item sm={12} md={12} lg={12}>
//               <Paper>
//                 <Scheduler data={this?.state?.timeTableDataArray}>
//                   <ViewState defaultCurrentDate={new Date()} />
//                   <MonthView />
//                   <Appointments appointmentComponent={Appointment} />
//                   <EditingState />
//                   <EditRecurrenceMenu title="title" />
//                   <AppointmentTooltip
//                     showCloseButton
//                     headerComponent={Header}
//                   />
//                   <Toolbar />
//                   <DateNavigator />
//                   <TodayButton />
//                   <CurrentTimeIndicator
//                     shadePreviousCells={true}
//                     shadePreviousAppointments={true}
//                     updateInterval={10000}
//                   />
//                 </Scheduler>
//               </Paper>
//             </Grid>
//             {/* <Grid item sm={12} md={4} lg={3}>
//               <F344MonthlyAttendanceFeatureInitials
//                 data={this.state.upcomingClassesDataArray}
//                 isLoading={this.state.isLoading}
//                 onJoinClick={(e, data) => this.onJoinClick(e, data)}
//               />
//             </Grid> */}
//           </Grid>
//         </form>
//         <CustomizedSnackbar
//           isOpen={this.state.isOpenSnackbar}
//           message={this.state.snackbarMessage}
//           severity={this.state.snackbarSeverity}
//           handleCloseSnackbar={() => this.handleCloseSnackbar()}
//         />
//       </Fragment>
//     );
//   }
// }
// export default withStyles(styles)(F344MonthlyAttendanceFeature);
