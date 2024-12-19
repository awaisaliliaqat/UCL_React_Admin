import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import {
  Divider,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  CircularProgress,
  TextField,
  MenuItem,
} from "@material-ui/core";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import BottomBar from "../../../../../components/BottomBar/BottomBar";

const styles = () => ({
  table: {
    minWidth: 700,
  },

  headerTitle: {
    fontWeight: 600,
  },
  columnsLoader: {
    display: "flex",
    justifyContent: "center",
    padding: 15,
  },
});

// eslint-disable-next-line no-unused-vars
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#306b9e",
    color: "white",
  },
  body: {
    // fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

class F321DefineEmployeesMonthlySalary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      employeePayrollsData: [],
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      sessionData: [],
      sessionId: "",

      yearData: [],
      yearId: "",

      monthId: "",
      monthIdError: "",
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

      allowances: [],
      deductions: [],

      isColumnsLoading: false,
      columns: [
        { id: 1, name: "id", title: "ID", colspan: 1 },
        { id: 2, name: "userLabel", title: "Employee", colspan: 1 },
        // { id: 3, name: "payrollMonths", title: "Number of Months", colspan: 1 },
        {
          id: 4,
          name: "perMonthSalary",
          title: "Per Month Salary",
          colspan: 1,
        },

        {
          id: 5,
          name: "leaveInCashment",
          title: "Leave Encashment",
          colspan: 2,
          subColumns: [
            {
              id: 1,
              label: "Days",
              isActive: 1,
            },
            {
              id: 2,
              label: "Amount",
              isActive: 1,
            },
          ],
        },
        // {
        //   id: 6,
        //   name: "",
        //   title: "Loan",
        //   colspan: 1,
        //   subColumns: [
        //     {
        //       id: 1,
        //       label: "Amount",
        //       isActive: 1,
        //     },
        //   ],
        // },
        {
          id: 7,
          name: "allowances",
          title: "Allowances",
          colspan: 1,
          subColumns: [],
        },
        { id: 6, name: "grossSalary", title: "Gross Salary", colspan: 1 },

        {
          id: 8,
          name: "deductions",
          title: "Deductions",
          colspan: 1,
          subColumns: [],
        },
        { id: 9, name: "netSalary", title: "Net Salary", colspan: 1 },
      ],
    };
  }

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  getDataForMonths = (data) => {
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

  getAllowancesColumnData = async () => {
    this.setState({
      isLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C321CommonEmployeesSalaryAllowancesLabelView`;
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
            let data = json.DATA || [];

            let { columns } = this.state;
            let index = columns.findIndex((item) => item.id == 7);
            columns[index]["subColumns"] = data;
            columns[index]["colspan"] = data.length == 0 ? 1 : data.length;
            this.setState({
              columns,
              allowances: data,
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

  getDeductionsColumnData = async () => {
    this.setState({
      isLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C321CommonEmployeesSalaryDeductionsLabelView`;
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
            let data = json.DATA || [];
            let { columns } = this.state;
            let index = columns.findIndex((item) => item.id == 8);
            let updatedDeductions = [
              ...data,
              {
                // deductionValue: item.adjustedAbsentDays,
                id: 8,
                isActive: 1,
                label: "Adjusted Absent Days",
              },
              {
                // deductionValue: item.adjustedAbsentDays,
                id: 9,
                isActive: 1,
                label: "Adjusted Late Days",
              },
            ];
            columns[index]["subColumns"] = updatedDeductions;
            columns[index]["colspan"] =
              updatedDeductions.length == 0 ? 1 : updatedDeductions.length;

            console.log(columns, "hello world");

            this.setState({
              columns,
              deductions: data,
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

  getData = async () => {
    this.setState({
      isLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C321CommonUsersEmployeesPayrollView?sessionId=${this.state.sessionId}&sessionPayrollMonthId=${this.state.monthId.id}`;
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
            let data = json.DATA || [];
            const allowances = this.state.allowances.map((item) => ({
              ...item,
              allowanceValue: 0,
            }));
            const deductions = this.state.deductions.map((item) => ({
              ...item,
              deductionValue: 0,
            }));

            const transformedData = data.map((item) => {
              const lateDays =
                item.adjustedLateDays !== ""
                  ? Number(item.adjustedLateDays)
                  : 0;

              const absentDays =
                item.adjustedAbsentDays !== ""
                  ? Number(item.adjustedAbsentDays)
                  : 0;
              const lateDaysSalary = (item.perMonthSalary / 30) * absentDays;

              const totalNetSalary = item.perMonthSalary - lateDaysSalary;
              console.log(
                totalNetSalary,
                lateDaysSalary,
                item.perMonthSalary,
                "totalNetSalary"
              );
              return {
                employeeId: item.userId.toString(),
                userLabel: item.userLabel,
                payrollMonths: item.payrollMonths,
                perMonthSalary: Number(item.perMonthSalary) || 0,
                homeRent: 0,
                fakeGrossSallary: Number(item.perMonthSalary) || 0,
                id: item.userId,
                grossSalary: Number(item.perMonthSalary) || 0,
                netSalary: Number(totalNetSalary) || 0,
                leaveInCashDays: 0,
                leaveInCashAmount: 0,
                loan: 0,
                leaveInCashment: [
                  {
                    id: 1,
                    label: "Days",
                    isActive: 1,
                    value: 0,
                  },
                  {
                    id: 2,
                    label: "Amount",
                    isActive: 1,
                    value: 0,
                  },
                ],
                allowances: [...allowances],
                deductions: [
                  ...deductions,
                  {
                    deductionValue: absentDays || 0,
                    id: 8,
                    isActive: 1,
                    label: "Adjusted Absent Days",
                  },
                  {
                    deductionValue: lateDays || 0,
                    id: 9,
                    isActive: 1,
                    label: "Adjusted Late Days",
                  },
                ],
              };
            });

            // console.log(transformedData)

            console.log(transformedData, "zeeshan");
            this.setState({
              employeePayrollsData: transformedData,
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

  getSessionData = async () => {
    this.setState({
      isLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C321CommonAcademicsSessionsView`;
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
            let data = json.DATA || [];
            this.setState({
              sessionData: data,
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

  getYearsData = async (value) => {
    this.setState({
      isLoading: true,
    });

    console.log(value);

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
            // const dataForMonths = this.getDataForMonths(data);
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

  onHandleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
    if (name === "sessionId") {
      this.getYearsData(value);
    }
    // if (name === "monthId") {
    //   this.getData();
    // }
  };

  componentDidMount() {
    this.getSessionData();
    // this.getYearsData();
    this.loadAllData();
  }

  loadAllData = async () => {
    this.setState({
      isColumnsLoading: true,
    });
    await this.getAllowancesColumnData();
    await this.getDeductionsColumnData();
    this.setState({
      isColumnsLoading: false,
    });
    // this.getData();
  };

  handleAllowanceDeductionChange = (
    type,
    employeeIndex,
    allowanceOrDeductionIndex,
    value
  ) => {
    this.setState((prevState) => {
      const updatedEmployeePayrollsData = [...prevState.employeePayrollsData];
      if (type === "allowances" || type === "deductions") {
        updatedEmployeePayrollsData[employeeIndex][type][
          allowanceOrDeductionIndex
        ] = {
          ...updatedEmployeePayrollsData[employeeIndex][type][
            allowanceOrDeductionIndex
          ],
          [`${type === "allowances" ? "allowanceValue" : "deductionValue"}`]:
            value ? parseFloat(value) : 0,
        };
      } else {
        updatedEmployeePayrollsData[employeeIndex][type] = value
          ? parseFloat(value)
          : 0;
      }

      const totalAllowances = updatedEmployeePayrollsData[
        employeeIndex
      ].allowances.reduce(
        (acc, allowance) => acc + allowance.allowanceValue,
        0
      );
      const totalDeductions = updatedEmployeePayrollsData[
        employeeIndex
      ].deductions.reduce(
        (acc, deduction) => acc + deduction.deductionValue,
        0
      );

      console.log(totalDeductions, totalAllowances);

      updatedEmployeePayrollsData[employeeIndex].grossSalary =
        Number(updatedEmployeePayrollsData[employeeIndex].fakeGrossSallary) +
        Number(totalAllowances);
      updatedEmployeePayrollsData[employeeIndex].netSalary =
        Number(updatedEmployeePayrollsData[employeeIndex].fakeGrossSallary) +
        Number(totalAllowances) -
        Number(totalDeductions);

      return { employeePayrollsData: updatedEmployeePayrollsData };
    });
  };
  handleLeaveEncashmentChange = (
    type,
    leaveIndex,
    allowanceOrDeductionIndex,
    value
  ) => {
    this.setState((prevState) => {
      const updatedEmployeePayrollsData = [...prevState.employeePayrollsData];
      const employee = updatedEmployeePayrollsData[leaveIndex];

      if (type === "leaveInCashment") {
        employee[type][allowanceOrDeductionIndex] = {
          ...employee[type][allowanceOrDeductionIndex],
          value: value ? parseFloat(parseFloat(value).toFixed(2)) : 0,
        };

        const days = parseFloat(employee.leaveInCashment[0].value) || 0;
        const leaveInCashAmount = (employee.perMonthSalary / 30.5) * days;
        const leaveIn = parseFloat(leaveInCashAmount.toFixed(0));
        console.log(leaveIn);

        if (allowanceOrDeductionIndex === 0) {
          const days = parseFloat(employee.leaveInCashment[0].value) || 0;
          const leaveInCashAmount = (employee.perMonthSalary / 30.5) * days;
          const leaveIn = parseFloat(leaveInCashAmount.toFixed(0));
          console.log(leaveIn);
          employee.leaveInCashment[1].value = leaveIn;
          employee.leaveInCashAmount = leaveIn;
          employee.leaveInCashDays = days;
        }
      } else {
        employee[type] = value ? parseFloat(value) : 0;
      }

      const totalAllowancesSum = employee.allowances.reduce(
        (acc, allowance) => acc + (allowance.allowanceValue || 0),
        0
      );
      const totalDeductionsSum = employee.deductions.reduce(
        (acc, allowance) => acc + (allowance.deductionValue || 0),
        0
      );

      const days = parseFloat(employee.leaveInCashment[0].value) || 0;
      const leaveInCashAmount = (employee.perMonthSalary / 30.5) * days;
      const leaveIn = parseFloat(leaveInCashAmount.toFixed(0));

      employee.grossSalary = Number(
        (
          Number(employee.perMonthSalary) +
          leaveIn +
          totalAllowancesSum -
          totalDeductionsSum
        ).toFixed(0)
      );

      employee.netSalary = Number(
        (
          Number(employee.perMonthSalary) +
          leaveIn +
          totalAllowancesSum -
          totalDeductionsSum
        ).toFixed(0)
      );

      employee.fakeGrossSallary = Number(
        (Number(employee.perMonthSalary) + leaveIn).toFixed(0)
      );

      return { employeePayrollsData: updatedEmployeePayrollsData };
    });
  };

  onApproveClick = async (e) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C321CommonEmployeesMonthlyPayrollVoucherSave`;

    const result = {
      year: this.state.yearId,
      sessionPayrollMonthId: this.state.monthId.id,
      fromDate: this.state.monthId.fromDate,
      toDate: this.state.monthId.toDate,
      sessionId: this.state.sessionId,
      employeePayrolls: this.state.employeePayrollsData.map((employee) => {
        // Separate deductions with id 8 and 9
        const absentDays =
          employee.deductions.find((deduction) => deduction.id === 8)
            ?.deductionValue || 0;
        const lateDays =
          employee.deductions.find((deduction) => deduction.id === 9)
            ?.deductionValue || 0;

        return {
          employeeId: employee.employeeId,
          homeRent: Number(employee.homeRent.toFixed(0)),
          grossSalary: Number(employee.grossSalary.toFixed(0)),
          netSalary: Number(employee.netSalary.toFixed(0)),
          leaveInCashDays: employee.leaveInCashDays,
          leaveInCashAmount: employee.leaveInCashAmount,

          adjustedAbsentDays: absentDays,
          adjustedLateDays: lateDays,

          deductions: employee.deductions
            .filter((deduction) => deduction.id !== 8 && deduction.id !== 9)
            .map((deduction) => ({
              deductionId: deduction.id,
              deductionValue: Number(deduction.deductionValue.toFixed(2)),
            })),

          allowances: employee.allowances.map((allowance) => ({
            allowanceId: allowance.id,
            allowanceValue: Number(allowance.allowanceValue.toFixed(2)),
          })),
        };
      }),
    };

    await fetch(url, {
      method: "POST",
      body: JSON.stringify(result),
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
        "Content-Type": "application/json",
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
            this.getData();
            this.setState({
              sessionId: "",
              monthId: "",
              isLoading: true,
            });

            this.handleSnackbar(true, "Saved", "success");
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

  viewReport = () => {
    window.location = "#/dashboard/F321DefineEmployeesMonthlySalaryView/0";
  };

  render() {
    const { classes } = this.props;
    const { employeePayrollsData } = this.state;
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
              Payroll Monthly Voucher
            </Typography>
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
              marginBottom: 20,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <div>
              <TextField
                id="sessionId"
                name="sessionId"
                label="Session"
                required
                style={{
                  width: "300px",
                  marginBottom: 20,
                  marginRight: 20,
                }}
                variant="outlined"
                onChange={this.onHandleChange}
                value={this.state.sessionId}
                // helperText={this.state.monthIdError}
                // error={this.state.monthIdError}
                select
              >
                {this.state.sessionData.map((item) => {
                  return (
                    <MenuItem key={item.ID} value={item.ID}>
                      {item.Label}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
            {/* <div>
              <TextField
                id="yearId"
                name="yearId"
                label="Years"
                required
                disabled={!this.state.sessionId}
                style={{
                  width: "300px",
                  marginBottom: 20,
                  marginRight: 20,
                }}
                variant="outlined"
                onChange={this.onHandleChange}
                value={this.state.yearId}
                // helperText={this.state.monthIdError}
                // error={this.state.monthIdError}
                select
              >
                {this.state.yearData.map((item) => {
                  return (
                    <MenuItem key={item.ID} value={item.ID}>
                      {item.Label}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div> */}
            <div>
              <TextField
                id="monthId"
                name="monthId"
                label="Month"
                disabled={!this.state.sessionId}
                required
                style={{
                  width: "300px",
                  marginBottom: 20,
                  marginRight: 20,
                }}
                variant="outlined"
                onChange={this.onHandleChange}
                value={this.state.monthId}
                helperText={this.state.monthIdError}
                error={this.state.monthIdError}
                select
              >
                {this.state.yearData.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item}>
                      {item.monthName}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
            <div className={classes.actions}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                disabled={this.state.isLoading}
                onClick={(e) => this.getData(e)}
              >
                {" "}
                {this.state.isLoading ? (
                  <CircularProgress style={{ color: "white" }} size={24} />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
              marginBottom: 20,
            }}
          />
          <TableContainer
            component={Paper}
            style={{
              paddingBottom: "30px",
              marginBottom: "3%",
            }}
          >
            <Table className={classes.table}>
              <TableHead>
                <TableRow
                  style={{
                    border: "1px solid white",
                  }}
                >
                  {this.state.columns?.map((item) => {
                    console.log(item);
                    return (
                      <StyledTableCell
                        style={{
                          border: "1px solid white",
                        }}
                        colSpan={item.colspan || 1}
                        className={classes.headerTitle}
                        key={item}
                      >
                        {item.title || "N/A"}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  {this.state.columns?.map((col) => {
                    if (col.subColumns && col.subColumns.length > 0) {
                      return (
                        <>
                          {col.subColumns?.map((item) => {
                            return (
                              <StyledTableCell
                                className={classes.headerTitle}
                                key={item}
                                style={{
                                  border: "1px solid white",
                                }}
                              >
                                {item.label || ""}
                              </StyledTableCell>
                            );
                          })}
                        </>
                      );
                    } else {
                      return <StyledTableCell>{""}</StyledTableCell>;
                    }
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {employeePayrollsData.map((employee, employeeIndex) => (
                  <StyledTableRow key={employee.employeeId}>
                    <TableCell className={classes.subColumnCell}>
                      {employee.employeeId}
                    </TableCell>
                    <TableCell className={classes.subColumnCell}>
                      {employee.userLabel}
                    </TableCell>
                    {/* <TableCell className={classes.subColumnCell}>
                      {/* <TextField
                        size="small"
                        variant="outlined"
                        value={ || ""}
                        onChange={(e) =>
                          this.handleAllowanceDeductionChange(
                            "payrollMonths",
                            employeeIndex,
                            null,
                            e.target.value
                          )
                        }
                      />

                      {employee.payrollMonths}
                    </TableCell> */}
                    <TableCell className={classes.subColumnCell}>
                      {employee.perMonthSalary}
                    </TableCell>
                    {/* <TableCell className={classes.subColumnCell}>
                      <TextField
                        size="small"
                        type="number"
                        variant="outlined"
                        value={employee.leaveInCashDays || ""}
                        onChange={(e) =>
                          this.handleAllowanceDeductionChange(
                            "leaveInCashDays",
                            employeeIndex,
                            null,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className={classes.subColumnCell}>
                      <TextField
                        size="small"
                        variant="outlined"
                        type="number"
                        value={employee.leaveInCashAmount || ""}
                        name=""
                        onChange={(e) =>
                          this.handleAllowanceDeductionChange(
                            "leaveInCashAmount",
                            employeeIndex,
                            null,
                            e.target.value
                          )
                        }
                      />
                    </TableCell> */}
                    {employee.leaveInCashment.map((leave, leaveIndex) => (
                      <TableCell
                        key={`allowance-${leaveIndex}`}
                        className={classes.subColumnCell}
                      >
                        <TextField
                          size="small"
                          style={{
                            width: leave.label === "Days" ? "50px" : "100px",
                          }}
                          variant="outlined"
                          value={leave.value}
                          disabled={leave.label === "Amount"}
                          onChange={(e) =>
                            this.handleLeaveEncashmentChange(
                              "leaveInCashment",
                              employeeIndex,
                              leaveIndex,
                              Math.max(0, parseFloat(e.target.value) || 0)
                            )
                          }
                        />
                      </TableCell>
                    ))}

                    {employee.allowances.length > 0 ? (
                      employee.allowances.map((allowance, allowanceIndex) => (
                        <TableCell
                          key={`allowance-${allowanceIndex}`}
                          className={classes.subColumnCell}
                        >
                          <TextField
                            size="small"
                            variant="outlined"
                            style={{
                              width: "100px",
                            }}
                            value={allowance.allowanceValue}
                            onChange={(e) =>
                              this.handleAllowanceDeductionChange(
                                "allowances",
                                employeeIndex,
                                allowanceIndex,
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                      ))
                    ) : (
                      <TableCell className={classes.subColumnCell}>
                        N/A
                      </TableCell>
                    )}
                    <TableCell className={classes.subColumnCell}>
                      {employee.grossSalary}
                    </TableCell>
                    {employee.deductions.length > 0 ? (
                      employee.deductions.map((deduction, deductionIndex) => (
                        <TableCell
                          key={`deduction-${deductionIndex}`}
                          className={classes.subColumnCell}
                        >
                          <TextField
                            size="small"
                            variant="outlined"
                            value={deduction.deductionValue}
                            style={{
                              width: "100px",
                            }}
                            disabled={deduction.id === 8 || deduction.id === 9}
                            onChange={(e) =>
                              this.handleAllowanceDeductionChange(
                                "deductions",
                                employeeIndex,
                                deductionIndex,
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                      ))
                    ) : (
                      <TableCell className={classes.subColumnCell}>
                        N/A
                      </TableCell>
                    )}
                    <TableCell className={classes.subColumnCell}>
                      {employee.netSalary}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
          />
        </div>

        <div>
          <BottomBar
            // left_button_hide
            left_button_text="View"
            left_button_hide={false}
            bottomLeftButtonAction={this.viewReport}
            right_button_text={this.state.isApproved ? "Saved" : "Save"}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            disableRightButton={!this.state.sessionId || !this.state.monthId}
            bottomRightButtonAction={() => this.onApproveClick()}
          />
        </div>
      </Fragment>
    );
  }
}

F321DefineEmployeesMonthlySalary.propTypes = {
  classes: PropTypes.object,
};

F321DefineEmployeesMonthlySalary.defaultProps = {
  classes: {},
};
export default withStyles(styles)(F321DefineEmployeesMonthlySalary);
