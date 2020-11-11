import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  TextField,
  MenuItem,
  Divider,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import { DatePicker } from "@material-ui/pickers";

const styles = {};

class R46Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadPdf: false,
      applicationStatusId: 1,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      academicSessionIdMenuItems: [],
      academicSessionId: "",
      academicSessionLabel: "",
      academicSessionIdError: "",
      programmeIdMenuItems: [],
      programmeId: "",
      programmeGroupLabel: "",
      programmeIdError: "",
      fromDate: new Date(),
      fromDateError: "",
      toDate: new Date(),
      toDateError: "",
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
    this.setState({ isOpenSnackbar: false });
  };

  loadAcademicSession = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C71CommonAcademicSessionsView`;
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
            this.setState({ academicSessionIdMenuItems: json.DATA });
            console.log(json.DATA);
            for (
              var i = 0;
              i < this.state.academicSessionIdMenuItems.length;
              i++
            ) {
              if (this.state.academicSessionIdMenuItems[i].isActive == "1") {
                var tempid = this.state.academicSessionIdMenuItems[i].ID;
                this.loadProgrammeGroups(tempid);
                this.state.academicSessionId = tempid;
                this.setState({
                  academicSessionLabel: this.state.academicSessionIdMenuItems[i]
                    .Label,
                });
              }
            }
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
          console.log("loadAcademicSession", json);
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

  loadProgrammeGroups = async (AcademicSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", AcademicSessionId);
    //const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C71CommonAcademicsSessionsOfferedProgrammesGroupView`;
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C71CommonAcademicsSessionsOfferedProgrammesView`;
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
            this.setState({ programmeIdMenuItems: json.DATA });
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
          console.log("loadProgrammeGroups", json);
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

  handleChangeFromDate = (date) => {
    this.setState({ fromDate: date });
  };

  handleChangeToDate = (date) => {
    this.setState({ toDate: date });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "academicSessionId":
        for (var i = 0; i < this.state.academicSessionIdMenuItems.length; i++) {
          if (value == this.state.academicSessionIdMenuItems[i].Id) {
            this.setState({
              academicSessionLabel: this.state.academicSessionIdMenuItems[i]
                .Label,
            });
          }
        }
        this.loadProgrammeGroups(value);
        break;
      case "programmeId":
        for (var i = 0; i < this.state.programmeIdMenuItems.length; i++) {
          if (value == this.state.programmeIdMenuItems[i].Id) {
            this.setState({
              programmeGroupLabel: this.state.programmeIdMenuItems[i]
                .Label,
            });
          }
        }

        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isCourseValid = () => {
    let isValid = true;
    if (!this.state.courseId) {
      this.setState({ courseIdError: "Please select course." });
      document.getElementById("courseId").focus();
      isValid = false;
    } else {
      this.setState({ courseIdError: "" });
    }
    return isValid;
  };

  handleGenerate = () => {
    let fromDate = new Date(this.state.fromDate).getTime();
    let toDate = new Date(this.state.toDate).getTime();
    let programmeGroup = this.state.programmeId;
    console.log(fromDate + "-" + toDate);
    window.open(
      `#/R71ReportsAttendanceRecordSheet/${
        this.state.academicSessionId +
        "&" +
        this.state.programmeId +
        "&" +
        fromDate +
        "&" +
        toDate +
        "&" +
        this.state.programmeGroupLabel +
        "&" +
        this.state.academicSessionLabel
      }`,
      "_blank"
    );
    //window.open(`#/R68ReportsAttendanceRecordSheet/0`,"_blank");
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadAcademicSession();
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
        <div
          style={{
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              Attendance Record
            </Typography>
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <br />
          <Grid container justify="center" alignItems="center" spacing={2}>
            <Grid item xs={12} md={6}>
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
                {this.state.academicSessionIdMenuItems.map((dt, i) => (
                  <MenuItem
                    key={"academicSessionIdMenuItems" + dt.ID}
                    value={dt.ID}
                  >
                    {dt.Label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="programmeId"
                name="programmeId"
                variant="outlined"
                label="Programme"
                onChange={this.onHandleChange}
                value={this.state.programmeId}
                error={!!this.state.programmeIdError}
                helperText={this.state.programmeIdError}
                disabled={!this.state.academicSessionId}
                required
                fullWidth
                select
              >
                {this.state.programmeIdMenuItems ? (
                  this.state.programmeIdMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"programmeIdMenuItems" + dt.Id}
                      value={dt.Id}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>
                    <CircularProgress size={24} />
                  </MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                autoOk
                name="fromDate"
                id="fromDate"
                label="From Date"
                invalidDateMessage=""
                placeholder=""
                variant="inline"
                inputVariant="outlined"
                format="dd-MM-yyyy"
                fullWidth
                required
                value={this.state.fromDate}
                onChange={this.handleChangeFromDate}
                error={!!this.state.fromDateError}
                helperText={this.state.fromDateError}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                autoOk
                name="toDate"
                id="toDate"
                label="From Date"
                invalidDateMessage=""
                placeholder=""
                variant="inline"
                inputVariant="outlined"
                format="dd-MM-yyyy"
                fullWidth
                required
                value={this.state.toDate}
                onChange={this.handleChangeToDate}
                error={!!this.state.toDateError}
                helperText={this.state.toDateError}
              />
            </Grid>
          </Grid>
          <BottomBar
            left_button_text="View"
            left_button_hide={true}
            bottomLeftButtonAction={this.viewReport}
            right_button_text="Genrate"
            bottomRightButtonAction={this.handleGenerate}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            disableRightButton={!this.state.programmeId}
          />
          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleCloseSnackbar()}
          />
        </div>
      </Fragment>
    );
  }
}
export default withStyles(styles)(R46Reports);
