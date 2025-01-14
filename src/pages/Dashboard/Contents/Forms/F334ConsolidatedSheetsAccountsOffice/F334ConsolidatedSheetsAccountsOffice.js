import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { Divider, CircularProgress, Grid, Button, Typography, TextField, MenuItem, } from "@material-ui/core";
import F334ConsolidatedSheetsAccountsOfficeTableComponent from "./chunks/F334ConsolidatedSheetsAccountsOfficeTableComponent";
import { IsEmpty } from "../../../../../utils/helper";
import BottomBar from "../../../../../components/BottomBar/BottomBar";

const styles = (theme) => ({
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
  divider: { 
    backgroundColor: "rgb(58, 127, 187)", 
    opacity: "0.3" 
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  button: {
    textTransform: "capitalize",
    padding: 13
  },
});

class F334ConsolidatedSheetsAccountsOffice extends Component {
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

      monthsData: [],
      monthsDataLoading: false,
      monthId: "",
      monthIdError: "",

      expandedGroupsData: [],

      teachersAttendanceSheetData: [],

      isApproved: false,
    };
  }

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

  getYearsData = async (value) => {
    this.setState({
      isLoading: true,
    });

    const formData = new FormData();
    formData.append("sessionId", value);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C334CommonMonthsView`;
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
            // const updatedData = this.getData(data);
            // console.log(updatedData);
            this.setState({
              yearData: data,
            });
          } else {
            this.handleSnackbar( true, json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error" );
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            this.handleSnackbar( true, "Failed to fetch, Please try again later.", "error" );
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C334CommonAcademicSessionsView`;
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
            this.handleSnackbar( true, <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
          }
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            this.handleSnackbar( true, "Failed to fetch ! Please try Again later.", "error" );
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C334CommonEmployeePayroleView`;
    var data = new FormData();
    data.append("academicsSessionId", this.state.academicSessionId);
    data.append("payrollMonthId", this.state.monthId.id);
    data.append("monthEnum", this.state.monthId.monthName);
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
            this.handleSnackbar( true, <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
          }
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            this.handleSnackbar( true, "Failed to fetch ! Please try Again later.", "error" );
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
      teachersAttendanceSheetData: [],
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;

    switch (name) {
      case "academicSessionId":
			this.getYearsData(value);
        break;
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

    
  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getAcademicSessions();
  }

  render() {
    const { classes } = this.props;

    const columns = [
      { name: "userId", title: "Emp#" },
      { name: "userLabel", title: "Employee Name" },
      { name: "ratePerHour", title: "Rate"},
		{ name: "netHoursAfterAdjustmentHours", title: "Claim Hours"},
		{ name: "hourlyAmount", title: "Claim Amount",
        // getCellValue: (rowData) => {
        //   return <div>{rowData.hourlyAmount.toFixed(0)}</div>;
        // },
      },
      { name: "perMonthSalary", title: "Gross Salary" },
		{ name: "monthlyAmount", title: "Salary Amount" },
      { name: "totalPayableAmountLabel", title: "Total Payable Amount" },
		{ name: "adjustedAbsentDays", title: "Adjusted Absent Days" },
		{ name: "adjustedLateDays", title: "Adjusted Late Days" }
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
              {"Consolidated Sheets For Accounts Office"}
              <br />
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <br />
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
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
					 inputProps={{
						id: "academicSessionId"
					 }}
              >
                {this.state.academicSessionsData?.map((item) => (
                  <MenuItem key={`academicSessionsData-${item.ID}`} value={item.ID}>
                    {item.Label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <br />
            <Grid item xs={12} md={5}>
              <TextField
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
					 disabled={!this.state.academicSessionId}
					 inputProps={{
						id: "monthId"
					 }}
              >
                {this.state.yearData?.map((item) => (
                  <MenuItem key={`yearData-${item.monthName}`} value={item}>
                    {item.monthName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={1}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						fullWidth
						disabled={this.state.isLoading || !this.state.academicSessionId || !this.state.monthId}
						onClick={(e) => this.onSearchClick(e)}
						className={classes.button}
					>
						{this.state.isLoading ? (
							<CircularProgress style={{ color: "white" }} size={24} />
						) : (
							"Search"
						)}
					</Button>
				</Grid>
				<Grid item xs={6} md={1}>
               <Button
                  variant="contained"
                  color="default"
						size="large"
						fullWidth
                  disabled={ this.state.isLoading || this.state.academicSessionsDataLoading }
                  onClick={() => this.onClearAllData()}
						className={classes.button}
                >
                  Clear
               </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.divider} />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <F334ConsolidatedSheetsAccountsOfficeTableComponent
              columns={columns}
              data={this.state}
            />
          </Grid>
			 <br/>
			 <br/>
			 <BottomBar
				leftButtonText="View"
				leftButtonHide={true}
				bottomLeftButtonAction={()=>{}}
				right_button_text="Save"
				bottomRightButtonAction={(e)=> this.handleSnackbar("Saved", "success" )}
				disableRightButton={!this.state.teachersAttendanceSheetData.length>0}
				loading={this.state.isLoading}
				isDrawerOpen={this.props.isDrawerOpen}
			/>
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

F334ConsolidatedSheetsAccountsOffice.propTypes = {
  classes: PropTypes.object,
  setDrawerOpen: PropTypes.func,
};

F334ConsolidatedSheetsAccountsOffice.defaultProps = {
  classes: {},
  setDrawerOpen: (fn) => fn,
};

export default withStyles(styles)(F334ConsolidatedSheetsAccountsOffice);
