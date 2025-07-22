import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import {
  Divider,
  CircularProgress,
  Grid,
  Button,
  Typography,
  TextField,
  MenuItem,
} from "@material-ui/core";
import F333SalaryHistoryViewTableComponent from "./chunks/F333SalaryHistoryViewTableComponent";
import { IsEmpty } from "../../../../../../utils/helper";
import BottomBar from "../../../../../../components/BottomBar/BottomBar";
import ViewTableRecord from "../../../../../../components/EditDeleteTableRecord/ViewTableRecord";
import F333HourlyHistoryViewTableComponent from "./chunks/F333HourlyHistoryViewTableComponent";

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

class F333SalaryHistoryView extends Component {
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

      columns1: [],

      expandedGroupsDataHourly: [],
      expandedGroupsDataMonthly: [],
      expandedGroupsDataMonthlyUpdated: [],

      teachersAttendanceSheetDataHourly: [],
      teachersAttendanceSheetDataMonthly: [],
      teacherAtttendanceSheetDataMonthlyUpdated: [],

      isApproved: false,
    };
  }
  componentDidMount(prevProps, prevState) {
    const recordId = this.props.match.params.id.split("T");
    console.log(recordId);

    this.props.setDrawerOpen(false);
    this.getAcademicSessions(
      recordId[0],
      recordId[1],
      recordId[2],
      recordId[3]
    );
  }

  // getYearsData = async (value) => {
  //   this.setState({
  //     isLoading: true,
  //   });

  //   const formData = new FormData();
  //   formData.append("sessionId", value);
  //   const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C331CommonYearsView`;
  //   await fetch(url, {
  //     method: "POST",
  //     body: formData,
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
  //           let data = json.DATA || [];
  //           this.setState({
  //             yearData: data,
  //           });
  //         } else {
  //           this.handleSnackbar(
  //             true,
  //             json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
  //             "error"
  //           );
  //         }
  //       },
  //       (error) => {
  //         if (error.status === 401) {
  //           this.setState({
  //             isLoginMenu: true,
  //             isReload: true,
  //           });
  //         } else {
  //           this.handleSnackbar(
  //             true,
  //             "Failed to fetch, Please try again later.",
  //             "error"
  //           );
  //           console.log(error);
  //         }
  //       }
  //     );
  //   this.setState({
  //     isLoading: false,
  //   });
  // };

  getAcademicSessions = async (sessionID, year, month, userId) => {
    this.setState({ academicSessionsDataLoading: true });

    const formData = new FormData();
    formData.append("sessionId", sessionID);
    formData.append("year", year);
    formData.append("month", month);
    formData.append("userId", userId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C333CommonUsersEmployeeSalaryHistoryView`;
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

            const data = this.transformSalaryData(
              json.DATA[0].monthlyDetail[0]
            );

            console.log(data);

            this.setState({
              expandedGroupsDataHourly: json.DATA[0].hourlySheetDetail,
              teachersAttendanceSheetDataHourly: json.DATA[0].hourlySheetDetail,
              teachersAttendanceSheetDataMonthly: json.DATA[0].monthlyDetail,
              expandedGroupsDataMonthly: json.DATA[0].monthlyDetail,
              teacherAtttendanceSheetDataMonthlyUpdated: [data],
              expandedGroupsDataMonthlyUpdated: [data],
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

  transformSalaryData = (data) => {
    const allowancesObj = data.allowances.reduce((acc, allowance) => {
      acc[allowance.allowanceLabel] = allowance.amount;
      return acc;
    }, {});

    const deductionsObj = data.deductions.reduce((acc, deduction) => {
      acc[deduction.allowanceLabel] = deduction.amount;
      return acc;
    }, {});

    return {
      ...data,
      ...allowancesObj,
      ...deductionsObj,
      // Remove the original allowances and deductions arrays if needed
      allowances: undefined,
      deductions: undefined,
    };
  };
  render() {
    const { classes } = this.props;

    const columns = [
      { name: "teacherLabel", title: "Teacher Name" },
      { name: "courseLabel", title: "Subjects" },
      { name: "programmeGroupLabel", title: "Program Group" },
      { name: "totalSchedules", title: "Total" },
      { name: "totalAttended", title: "Attended" },
      { name: "durationPerSession", title: "Duration Per Session" },
      // { name: "ratePerHour", title: "Rate Per Hour" },

      { name: "totalHours", title: "Total Hours" },

      // { name: "totalHours", title: "Adjustment Hours" },
      // { name: "totalHours", title: "Net Hours" },
      // { name: "totalHours", title: "Adjustment Remarks" },

      // {
      //   name: "adjustedHours",
      //   title: "Adjusted Hours",
      //   getCellValue: (rowData) => {
      //     console.log(rowData);

      //     return (
      //       <TextField
      //         variant="outlined"
      //         size="small"
      //         name="adjustedHours"
      //         disabled={
      //           !this.state.academicSessionId ||
      //           !this.state.programmeGroupId ||
      //           !this.state.monthId ||
      //           this.state.teachersAttendanceSheetData?.length <= 0 ||
      //           this.state.isApproved
      //         }
      //         type="number"
      //         value={rowData.adjustedHours || ""}
      //         onChange={(event) =>
      //           this.handleRatePerHourChange(event.target.value, rowData)
      //         }
      //       />
      //     );
      //   },
      // },

      { name: "totalNetHours", title: "Net Hours" },
      // {
      //   name: "adjustmentRemarks",
      //   title: "Adjusted Remarks",
      //   getCellValue: (rowData) => {
      //     return (
      //       <TextField
      //         variant="outlined"
      //         size="small"
      //         name="adjustedRemarks"
      //         disabled={
      //           !this.state.academicSessionId ||
      //           !this.state.programmeGroupId ||
      //           !this.state.monthId ||
      //           this.state.teachersAttendanceSheetData?.length <= 0 ||
      //           this.state.isApproved
      //         }
      //         type="text"
      //         value={rowData.adjustedRemarks || ""}
      //         onChange={(event) =>
      //           this.handleAdjustedHourChange(event.target.value, rowData)
      //         }
      //       />
      //     );
      //   },
      // },

      // { name: "ratePerHour", title: "Rate Per Hour" },
      // { name: "totalAmount", title: "Total Amount" },
    ];

    const dummyColumns = [
      { name: "employeeLabel", title: "Name" },
      { name: "perMonthSalary", title: "Per Month Salary" },
      { name: "leaveInCashDays", title: "LE Days" },
      { name: "grossSalary", title: "Gross Salary" },
      { name: "netSalary", title: "Net Salary" },
    ];

    const columns1 = [
      // { name: "employeeId", title: "ID" },
      { name: "employeeLabel", title: "Name" },
      { name: "perMonthSalary", title: "Per Month Salary" },
      { name: "leaveInCashDays", title: "LE Days" },

      // { name: "totalHours", title: "Total Hours" },
      // { name: "netHours", title: "Net Hours" },
    ];

    const allowanceColumns =
      this.state?.expandedGroupsDataMonthly[0]?.allowances?.map(
        (allowance) => ({
          name: allowance.allowanceLabel,
          title: allowance.allowanceLabel,
        })
      );
    const columns2 = [{ name: "grossSalary", title: "Gross Salary" }];
    const deductionColumns =
      this.state?.expandedGroupsDataMonthly[0]?.deductions?.map(
        (deduction) => ({
          name: deduction.allowanceLabel,
          title: deduction.allowanceLabel,
        })
      );

    const columns3 = [{ name: "netSalary", title: "Net Salary" }];

    var allColumns = [];
    if (allowanceColumns !== undefined && deductionColumns !== undefined) {
      allColumns = [
        ...columns1,
        ...allowanceColumns,
        ...columns2,
        ...deductionColumns,
        ...columns3,
      ];
    }

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
              {"Salary History Report"}
              <br />
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <br />
          <Grid container justifyContent="left" alignItems="left" spacing={2}>
            {/* <Grid item xs={12} md={2}>
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
            </Grid> */}

            {/* <Grid item xs={12} md={3}>
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
            </Grid> */}
            <Grid item xs={12}>
              <div className={classes.titleContainer}>
                <Typography className={classes.title} variant="h6">
                  {"Hourly Salary"}
                  <br />
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.divider} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <F333HourlyHistoryViewTableComponent
              columns={columns}
              data={this.state}
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{
              marginTop: "17px",
              marginBottom: "17px",
            }}
          >
            <div className={classes.titleContainer}>
              <Typography className={classes.title} variant="h6">
                {"Monthly Salary"}
                <br />
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Divider className={classes.divider} />
          </Grid>

          <Grid item xs={12}>
            {allColumns.length !== 0 ? (
              <F333SalaryHistoryViewTableComponent
                columns={allColumns}
                data={this.state}
              />
            ) : (
              <F333SalaryHistoryViewTableComponent
                columns={dummyColumns}
                data={this.state}
              />
            )}
          </Grid>

          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
          />

          {/* <BottomBar
            // leftButtonHide
            leftButtonText="View"
            leftButtonHide={false}
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
          /> */}
        </div>
      </Fragment>
    );
  }
}

F333SalaryHistoryView.propTypes = {
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

F333SalaryHistoryView.defaultProps = {
  classes: {},
  setDrawerOpen: (fn) => fn,
};
export default withStyles(styles)(F333SalaryHistoryView);
