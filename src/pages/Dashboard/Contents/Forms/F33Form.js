import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import {TextField, Grid} from "@material-ui/core";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, DayView, MonthView, Appointments, Toolbar, DateNavigator, TodayButton,ConfirmationDialog } from '@devexpress/dx-react-scheduler-material-ui';
// import { appointments } from "./monthappointments";
import F33FormInitials from "./F33FormInitials";

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
      upcomingClassesDataArray: []
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C33CommonAcademicsTimeTableView`;
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
            this.handleOpenSnackbar(json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,"error");
          }
          console.log("loadTimeTableData", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };
  
  loadUpcomingClassesData = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C33CommonAcademicsTimeTableUpcomingClassesView`;
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
            this.handleOpenSnackbar(json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,"error");
          }
          console.log("loadUpcomingClassesData", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C31CommonAcademicsScheduleSave`;
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
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
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
    const { data } = this.state;
    return (
      <Fragment>
        <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })}/>
        <form id="myForm" onSubmit={this.isFormValid}>
          <TextField type="hidden" name="id" value={this.state.recordId} />
          <Grid 
            container
            component="main" 
            className={classes.root}
            spacing={2}
          >
            <Grid item sm={8} md={9}>
              <Paper>
                <Scheduler data={this.state.timeTableDataArray}>
                  <ViewState defaultCurrentDate={new Date()}/>
                  <MonthView />
                  <Appointments />
                  {/* 
                  <AppointmentTooltip
                    showCloseButton
                    showOpenButton
                  /> 
                  */}
                  <Toolbar />
                  <DateNavigator />
                  <TodayButton />
                </Scheduler>
              </Paper>
            </Grid>
            <Grid item sm={4} md={3}>
              <F33FormInitials 
                data={this.state.upcomingClassesDataArray}
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
