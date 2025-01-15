import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, Divider, Tooltip, Typography, CircularProgress } from "@material-ui/core";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import { Scheduler, DayView, MonthView, Appointments, Toolbar, DateNavigator, TodayButton, 
  AppointmentTooltip, EditRecurrenceMenu, CurrentTimeIndicator } from '@devexpress/dx-react-scheduler-material-ui';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import classNames from 'clsx';
import QueuePlayNextOutlinedIcon from '@material-ui/icons/QueuePlayNextOutlined';
import Autocomplete from "@material-ui/lab/Autocomplete";

const style = ({ palette }) => ({
  icon: {
    color: palette.action.active,
  },
  textCenter: {
    textAlign: 'center',
  },
  header: {
    height: '260px',
    backgroundSize: 'cover',
  },
  commandButton: {
    backgroundColor: 'rgba(255,255,255,0.65)',
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

const Header = withStyles(style, { name: 'Header' })(({ children, appointmentData, classes, ...restProps }) => (
  <AppointmentTooltip.Header
    {...restProps}
    appointmentData={appointmentData}
  >
    {/* {appointmentData.meetingStartUrl &&
      <Tooltip title="Join">
        <IconButton
          //onClick={() => alert(JSON.stringify(appointmentData))}
          //onClick={(e) => this.onJoinClick(e, appointmentData)}
          className={classes.commandButton}
        >
          <QueuePlayNextOutlinedIcon color="primary" />
        </IconButton>
      </Tooltip>
    } */}
  </AppointmentTooltip.Header>
));

const Appointment = ({children, style, ...restProps}) => (
  <Appointments.Appointment
    {...restProps}
    style = { 
      restProps.data.isCanceled ? 
        {...style, backgroundColor: '#f5594e'} 
        : 
        { ...style } 
    }
  >
   {children}
  </Appointments.Appointment>
);

class R73Reports extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      teachersMenuItems: [],
      teacherId: "",
      teacherIdError: "",
      timeTableDataArray: []
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

  loadTeachers = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C73CommonTeacherView`;
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
            this.setState({teachersMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadTeachers", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
            console.log(error);
          }
        }
      );
    this.setState({isLoading: false});
  };

  loadTimeTableData = async (teacherId=0) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("teacherId", teacherId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C73CommonAcademicsTimeTableView`;
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
            this.setState({ timeTableDataArray: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
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
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.", "error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  handleSetTeacher = (value) => {
    if(value) { 
      this.loadTimeTableData(value.id);
    }else{
      this.setState({timeTableDataArray:[]});
    }
    this.setState({
      teacherId: value, 
      teacherIdError: ""
    });
  };

  onJoinClick = async (e, data = {}) => {
    e.preventDefault();
    this.setState({
      isLoading: true
    })
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C33CommonAcademicsAttendanceTeachersLogSave?classId=${data.id}&typeId=${1}`;
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
            window.open(data.meetingStartUrl, '_blank');
          } else {
            if (json.CODE === 1) {
              let data = json.DATA || [];
              this.setState({ timeTableDataArray : data });
            } else {
              this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
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
            alert("Operation Faild ! Please try again")
          }
        }
      );
    this.setState({
      isLoading: false
    })
  }

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadTeachers();
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
        <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
        <form id="myForm" onSubmit={this.isFormValid}>
          <TextField type="hidden" name="id" value={this.state.recordId} />
          <Grid
            container
            component="main"
            justifyContent="space-around"
            className={classes.root}
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography
                style={{
                  color: "#1d5f98",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  borderBottom: "1px solid rgb(58, 127, 187, 0.3)"
                }}
                variant="h5"
              >
                Teacher Wise Calendar
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                fullWidth
                id="teacherId"
                options={this.state.teachersMenuItems}
                value={this.state.teacherId}
                onChange={(event, value) => this.handleSetTeacher(value)}
                getOptionLabel={(option) => typeof option.label === 'string' ? option.label : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Teachers"
                    placeholder="Search and Select"
                    error={!!this.state.teacherIdError}
                    helperText={this.state.teacherIdError ? this.state.teacherIdError : "" }
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} lg={11} xl={10}>
              <Divider 
                style={{
                  backgroundColor: "rgb(58, 127, 187, 0.3)"
                }}
              />
            </Grid>
            <Grid item sm={12} lg={11} xl={10}>
              <Paper>
                {this.state.isLoading ?
                  <Grid style={{textAlign:"center", padding:20}}>
                    <CircularProgress fontSize="24"/>
                  </Grid>
                : 
                  <Scheduler data={this.state.timeTableDataArray}>
                    <ViewState defaultCurrentDate={new Date()}/>
                    <MonthView />
                    <Appointments appointmentComponent={Appointment}/>
                    <EditingState />
                    <EditRecurrenceMenu title="title" />
                    <AppointmentTooltip showCloseButton headerComponent={Header}/>
                    <Toolbar />
                    <DateNavigator/>
                    <TodayButton />
                    <CurrentTimeIndicator shadePreviousCells={true} shadePreviousAppointments={true} updateInterval={10000}/>
                  </Scheduler>
                }
              </Paper>
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
export default withStyles(styles)(R73Reports);
