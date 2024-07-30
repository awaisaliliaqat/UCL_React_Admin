import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import {
  Divider,
  IconButton,
  Tooltip,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";

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

      isColumnsLoading: false,
      columns: [
        { id: 1, name: "id", title: "ID", colspan: 1 },
        { id: 2, name: "userLabel", title: "Employee", colspan: 1 },
        { id: 3, name: "payrollMonths", title: "Number of Months", colspan: 1 },
        {
          id: 4,
          name: "perMonthSalary",
          title: "Per Month Salary",
          colspan: 1,
        },
        { id: 5, name: "grossSalary", title: "Gross Salary", colspan: 1 },
        {
          id: 6,
          name: "allowances",
          title: "Allowances",
          colspan: 3,
          subColumns: [],
        },
        {
          id: 7,
          name: "deductions",
          title: "Deductions",
          colspan: 3,
          subColumns: [],
        },
        { id: 8, name: "netSalary", title: "Net Salary", colspan: 1 },
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

  getAllowancesColumnData = async () => {
    this.setState({
      isLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C321CommonEmployeesSalaryAllowancesLabelView`;
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
            let index = columns.findIndex((item) => item.id == 6);
            columns[index]["subColumns"] = data;
            columns[index]["colspan"] = data.length == 0 ? 1 : data.length;
            this.setState({
              columns,
            });
          } else {
            this.handleSnackbar(
              true,
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
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
            let index = columns.findIndex((item) => item.id == 7);
            columns[index]["subColumns"] = data;
            columns[index]["colspan"] = data.length == 0 ? 1 : data.length;
            this.setState({
              columns,
            });
          } else {
            this.handleSnackbar(
              true,
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C316CommonUsersEmployeesPayrollView`;
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

            let testData = [
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
              ...data,
            ];

            console.log(testData);
            this.setState({
              employeePayrollsData: testData,
            });
          } else {
            this.handleSnackbar(
              true,
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
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
  };

  componentDidMount() {
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
    this.getData();
  };

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
              Define Employee&apos;s Monthly Salary
            </Typography>
            <div style={{ float: "right" }}>
              <Tooltip title="Table Filter">
                <IconButton
                  style={{ marginLeft: "-10px" }}
                  onClick={() => this.handleToggleTableFilter()}
                >
                  <FilterIcon fontSize="default" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
              marginBottom: 20,
            }}
          />

          <TableContainer component={Paper}>
            {this.state.isColumnsLoading ? (
              <div className={classes.columnsLoader}>
                {" "}
                <CircularProgress />{" "}
              </div>
            ) : (
              <Table
                stickyHeader
                className={classes.table}
                aria-label="spanning table"
              >
                <TableHead>
                  <TableRow>
                    {this.state.columns?.map((item) => {
                      return (
                        <StyledTableCell
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
                {!this.state.isColumnsLoading && !this.state.isLoading && (
                  <TableBody>
                    {this.state.employeePayrollsData?.map((item) => {
                      return (
                        <>
                          <StyledTableRow>
                            {this.state.columns?.map((col) => {
                              if (col.id == 6) {
                                return (
                                  <>
                                    {col.subColumns?.map((subCol) => {
                                      return (
                                        <>
                                          <TableCell>
                                            <TextField
                                              size="small"
                                              type="number"
                                              placeholder={subCol.label}
                                            />
                                          </TableCell>
                                        </>
                                      );
                                    })}
                                  </>
                                );
                              } else if (col.id == 7) {
                                return (
                                  <>
                                    {col.subColumns?.map((subCol) => {
                                      return (
                                        <>
                                          <TableCell>
                                            <TextField
                                              size="small"
                                              type="number"
                                              fullWidth
                                              placeholder={subCol.label}
                                            />
                                          </TableCell>
                                        </>
                                      );
                                    })}
                                  </>
                                );
                              } else {
                                const value = item[col.name] || "0";
                                return (
                                  <>
                                    <TableCell>{value}</TableCell>
                                  </>
                                );
                              }
                            })}
                          </StyledTableRow>
                        </>
                      );
                    })}
                  </TableBody>
                )}
              </Table>
            )}
            <>
              {!this.state.isColumnsLoading && this.state.isLoading && (
                <div className={classes.columnsLoader}>
                  {" "}
                  <CircularProgress />{" "}
                </div>
              )}
            </>
          </TableContainer>
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

F321DefineEmployeesMonthlySalary.propTypes = {
  classes: PropTypes.object,
};

F321DefineEmployeesMonthlySalary.defaultProps = {
  classes: {},
};
export default withStyles(styles)(F321DefineEmployeesMonthlySalary);
