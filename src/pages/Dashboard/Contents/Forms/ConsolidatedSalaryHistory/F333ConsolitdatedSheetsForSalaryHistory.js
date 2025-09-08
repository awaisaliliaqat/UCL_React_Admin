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
import F333ConsolitdatedSheetsForSalaryHistoryTableComponent from "./chunks/F333ConsolitdatedSheetsForSalaryHistoryTableComponent";
import { IsEmpty } from "../../../../../utils/helper";
import { Link } from "react-router-dom";

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

class F333ConsolitdatedSheetsForSalaryHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,

      isLoginMenu: false,
      isReload: false,

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      yearData: [],
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
    this.props.setDrawerOpen(false);
    this.getAcademicSessions();
  }

  getYearsData = async (value) => {
    this.setState({
      isLoading: true,
    });

    const formData = new FormData();
    formData.append("sessionId", value);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C330CommonMonthsView`;
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
            // const dataForMonths = this.getData(data);
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C330CommonAcademicSessionsView`;
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

  onSearchClick = async (e) => {
    if (!IsEmpty(e)) {
      e.preventDefault();
    }

    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C333CommonEmployeePayroleView`;
    var data = new FormData();
    data.append("academicsSessionId", this.state.academicSessionId);
    data.append("monthEnum", this.state.monthId.monthName);
    data.append("year", 0);

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

  getData = (data) => {
    const formattedArray = Object.entries(data[0]).map(
      ([monthName, dates]) => ({
        fromDate: dates[0],
        toDate: dates[1],
        monthName,
      })
    );

    const sortedArray = formattedArray.sort(
      (a, b) => new Date(a.fromDate) - new Date(b.fromDate)
    );

    const augustIndex = sortedArray.findIndex((item) =>
      item.monthName.includes("August")
    );
    const rearrangedArray = [
      ...sortedArray.slice(augustIndex),
      ...sortedArray.slice(0, augustIndex),
    ];

    return rearrangedArray;
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

    if (name === "academicSessionId") {
      this.getYearsData(value);
    }

    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  render() {
    const { classes } = this.props;

    const columns = [
      { name: "userId", title: "Employee ID" },
      { name: "userLabel", title: "Employee Name" },
      { name: "departmentsLabel", title: "Department" },
      { name: "designationsLabel", title: "Designation" },
      {
        name: "paymentThrough",
        title: "Payment Through",
        getCellValue: (rowData) => {
          console.log(rowData);
          return (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "row",
              }}
            >
              {rowData.paymentThrough === "Cheque" ? "Cheque" : "Bank Account"}
              <br />
              {rowData.backAccount1 !== ""
                ? `SCB : ${rowData.backAccount1}`
                : ""}
              <br />
              {rowData.backAccount2 !== ""
                ? `Faysal Bank : ${rowData.backAccount2}`
                : ""}
            </div>
          );
        },
      },

      // { name: "backAccount1", title: "Bank 1 Account #" },
      // { name: "backAccount2", title: "Bank 2 Account #" },
      { name: "hourlyAmount", title: "Hourly Amount" },
      { name: "monthlyAmount", title: "Monthly Amount" },
      { name: "totalPayableAmountLabel", title: "Total Payable Amount" },
      {
        name: "action",
        title: "Actions",
        getCellValue: (rowData) => {
          console.log(rowData);
          return (
            <Fragment>
              <a
                href={`#/dashboard/F333SalaryHistoryView/${this.state.academicSessionId}T${this.state.yearId}T${this.state.monthId}T${rowData.userId}`}
                target="_blank"
                style={{ color: "green" }}
              >
                View
              </a>
            </Fragment>
          );
        },
      },
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
              {"Consolidated Salary History"}
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
            */}

            {/* <Grid item xs={12} md={3}>
              <TextField
                id="yearId"
                name="yearId"
                variant="outlined"
                label="Year"
                disabled={!this.state.academicSessionId}
                onChange={this.onHandleChange}
                value={this.state.yearId}
                // error={!!this.state.monthIdError}
                // helperText={this.state.monthIdError}
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
                fullWidth
                select
              >
                {this.state.yearData?.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item.monthName}
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
            <F333ConsolitdatedSheetsForSalaryHistoryTableComponent
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

F333ConsolitdatedSheetsForSalaryHistory.propTypes = {
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

F333ConsolitdatedSheetsForSalaryHistory.defaultProps = {
  classes: {},
  setDrawerOpen: (fn) => fn,
};
export default withStyles(styles)(F333ConsolitdatedSheetsForSalaryHistory);
