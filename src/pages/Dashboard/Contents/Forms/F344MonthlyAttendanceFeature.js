import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TextField,
  Typography,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import { format, getDaysInMonth } from "date-fns";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const styles = (theme) => ({
  tableContainer: {
    width: "100%",
    margin: "0 auto",
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  employeeNameCell: {
    display: "flex",
    alignItems: "center",
  },
  employeeImage: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    marginRight: theme.spacing(1),
  },
  monthSelect: {
    margin: theme.spacing(2),
    minWidth: 100,
  },
  attendanceCell: {
    minWidth: 100, // Increase the minimum width for better visibility
    // textAlign: "center", // Center align the text
  },
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

class F344MonthlyAttendanceFeature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
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
      employees: [],
      dates: [],
      isLoading: false,

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
    };
  }

  handleDateChange = (event) => {
    const newDate = new Date(event.target.value);

    this.setState({ selectedDate: newDate });
    const monthName = newDate.toLocaleString("en-US", { month: "long" });
    const year = newDate.getFullYear();
    this.getAcademicSessions(monthName, year);
  };

  componentDidMount() {
    const findMonth = this.state.monthsData.find(
      (item) => item.id === this.state.month
    );
    this.getAcademicSessions(findMonth.label, this.state.year);
  }

  getFormattedAttendanceDates = (data) => {
    console.log(data);
    return data.map((item) => {
      const [day, month, year] = item.attendanceDate.split("/");
      const dateObj = new Date(`${year}-${month}-${day}`);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        weekday: "short",
      }).format(dateObj);
    });
  };

  getAcademicSessions = async (month, year) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C344MonthlyEmployeeGateAttendanceView?month=${month}&year=${year}`;
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
            console.log(array, "data is coming");
            if (json.DATA[0]?.attendance.length > 0) {
              const result = this?.getFormattedAttendanceDates(
                json.DATA[0]?.attendance
              );
              console.log(result);

              this.setState({ employees: array, dates: [...result] });
            } else {
              this.setState({ employees: [], dates: [] });
              this.handleSnackbar(
                true,
                <span>{"There is no record found againt this month!"}</span>,
                "error"
              );
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
    this.setState({ isLoading: false });
  };

  generateDates = () => {
    const { selectedDate } = this.state;
    const numberOfDays = getDaysInMonth(selectedDate);
    const dates = [];

    for (let i = 1; i <= numberOfDays; i++) {
      dates.push(
        format(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i),
          "MMM dd EEE"
        )
      );
    }
    return dates;
  };

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  render() {
    const { classes } = this.props;
    const { employees, selectedDate } = this.state;
    // const dates = this.generateDates();

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <div
          style={{
            margin: "25px",
          }}
        >
          <div className={classes.titleContainer}>
            <Typography className={classes.title} variant="h5">
              {"Employee Gate Attendance Monthly"}
              <br />
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <br />
          <TextField
            type="month"
            label="Select Month"
            value={format(selectedDate, "yyyy-MM")}
            onChange={this.handleDateChange}
            className={classes.monthSelect}
            variant="outlined"
            style={{
              width: "340px",
            }}
          />

          <Divider
            className={classes.divider}
            style={{
              opacity: "0.3",
              marginBottom: 25,
            }}
          />

          {this.state.isLoading ? (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(255, 255, 255, 0)",
              }}
            >
              <CircularProgress />
            </div>
          ) : this.state.employees.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                fontSize: "18px",
                color: "gray",
              }}
            >
              No records found
            </div>
          ) : (
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <div
                style={{
                  maxHeight: "600px",
                  overflowY: "auto",
                  overflowX: "auto",
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHeader}>
                        Employee Name
                      </TableCell>
                      {this.state.dates.map((date, index) => (
                        <TableCell key={index} className={classes.tableHeader}>
                          {date}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {employees.map((employee, index) => (
                      <TableRow key={index}>
                        <TableCell
                          className={classes.employeeNameCell}
                          style={{
                            height: "41px",
                            position: "sticky",
                            left: 0,
                            backgroundColor: "#fff",
                            zIndex: 1,
                          }}
                        >
                          {employee.name}
                        </TableCell>
                        {employee.attendance.map((entry, idx) => (
                          <TableCell
                            key={idx}
                            className={classes.attendanceCell}
                          >
                            {entry.checkIn || entry.checkOut
                              ? `In: ${entry.checkIn}  Out: ${entry.checkOut}`
                              : "N/A"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          )}
        </div>
        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(F344MonthlyAttendanceFeature);
