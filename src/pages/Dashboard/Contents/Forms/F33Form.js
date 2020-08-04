import React, { Component, Fragment } from "react";
import * as React2 from 'react';
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import {
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Divider,
  Typography,
  IconButton,
  Tooltip,
  List,
} from "@material-ui/core";
import FilterIcon from "mdi-material-ui/FilterOutline";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import F31FormFilter from "./F31FormFilter";
import F31FormTableComponent from "./F31FormTableComponent";
import F31FormPopupComponent from "./F31FormPopupComponent";
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  MonthView,
  Appointments,
  Toolbar,
  DateNavigator,
  TodayButton
} from '@devexpress/dx-react-scheduler-material-ui';

// import { appointments } from "./monthappointments";


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
      academicSessionIdMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      programmeGroupIdMenuItems: [],
      programmeGroupId: "",
      programmeGroupIdError: "",
      preDaysMenuItems: [], //["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      preTimeStartMenuItems: [],
      showTableFilter: false,
      TimeTableDataArray: [],
      date:[],
      currentDate: new Date(),
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

  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  handleToggleSearchBar = () => {
    this.setState({ showSearchBar: !this.state.showSearchBar });
  };

  getPreTimeSlotsMenuItems = () => {
    var x = 15; //minutes interval
    var times = []; // time array
    var tt = 480; // start time 0 For 12 AM
    var ap = ["AM", "PM"]; // AM-PM

    //loop to increment the time and push results in array
    for (var i = 0; tt < 24 * 60; i++) {
      var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
      var mm = tt % 60; // getting minutes of the hour in 0-55 format
      times[i] =
        ("0" + (hh % 12)).slice(-2) +
        ":" +
        ("0" + mm).slice(-2) +
        " " +
        ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
      tt = tt + x;
      if (times[i] == "08:00 PM") {
        break;
      }
    }
    //console.log(times);
    this.setState({ preTimeStartMenuItems: times });
  };

 

  loadTimeTableData = async (teacherId) => {
    let data = new FormData();
    data.append("teacherId", teacherId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C33CommonAcademicsTimeTableView`;
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
            this.setState({ TimeTableDataArray: json.DATA });

            //  dataArray = new List();

            // if (this.state.TimeTableDataArray != null) {
            //   for (let i = 0; i < this.state.TimeTableDataArray.length; i++) {
            //     // dataArray.append("title", dayId[i].value);
            //     // dataArray.append("startDate", startTime[i].value);
            //     // dataArray.append("endDate", duration[i].value);
            //   }
            // }
        


          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("TimeTableDataArray", json);
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
    this.loadTimeTableData(2216);
   
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
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <form id="myForm" onSubmit={this.isFormValid}>
          <TextField type="hidden" name="id" value={this.state.recordId} />
          <Grid container component="main" className={classes.root}>
            <Paper>
              <Scheduler data={this.state.TimeTableDataArray}>
                <ViewState
                  defaultCurrentDate="2020-08-01"
                />
                <MonthView 
                 
                />
                <Appointments />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
              </Scheduler>
            </Paper>
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
