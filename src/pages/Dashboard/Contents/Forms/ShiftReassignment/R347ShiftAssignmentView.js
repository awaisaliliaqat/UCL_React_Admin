import React, { Component, Fragment } from "react";
import { Divider, IconButton, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import R347ShiftReassignmentViewTableComponent from "./Chunks/R347ShiftReassignmentViewTableComponent";
import { withRouter } from "react-router-dom";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

class R347ShiftAssignmentView extends Component {
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
    };
  }

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  getData = async () => {
    this.setState({
      isLoading: true,
    });
    // const formData = new FormData();
    // formData.append("recordId", 0);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C347CommonEmployeeShiftView`;
    await fetch(url, {
      method: "POST",
      // body: formData,
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
              employeePayrollsData: data,
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

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    const columns = [
      { name: "employeeId", title: "Employee Id" },
      { name: "employeeLabel", title: "Employee Name" },
      { name: "shiftLabel", title: "Shift Name" },
      { name: "startDate", title: "Start Date" },
      {
        name: "days",
        title: "Days",
        flex: 1,
        getCellValue: (rowData) => {
          return (
            <>
              {rowData.days.length !== 0 ? (
                rowData.days.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      borderBottom:
                        index === rowData.days.length - 1
                          ? "none"
                          : "1px solid #DADBDD",
                      minHeight: "30px",
                    }}
                  >
                    {item.dayLabel}
                  </div>
                ))
              ) : (
                <div style={{ minHeight: "30px" }}></div>
              )}
            </>
          );
        },
      },
      {
        name: "startTime",
        title: "Start Time",
        flex: 1,
        getCellValue: (rowData) => {
          return (
            <>
              {rowData.days.length !== 0 ? (
                rowData.days.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      borderBottom:
                        index === rowData.days.length - 1
                          ? "none"
                          : "1px solid #DADBDD",
                      minHeight: "30px",
                    }}
                  >
                    {item.startTime}
                  </div>
                ))
              ) : (
                <div style={{ minHeight: "30px" }}></div>
              )}
            </>
          );
        },
      },
      {
        name: "endTime",
        title: "End Time",
        flex: 1,
        getCellValue: (rowData) => {
          return (
            <>
              {rowData.days.length !== 0 ? (
                rowData.days.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      borderBottom:
                        index === rowData.days.length - 1
                          ? "none"
                          : "1px solid #DADBDD",
                      minHeight: "30px",
                    }}
                  >
                    {item.endTime}
                  </div>
                ))
              ) : (
                <div style={{ minHeight: "30px" }}></div>
              )}
            </>
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
              <Tooltip title="Back">
                <IconButton
                  onClick={() =>
                    window.location.replace(
                      "#/dashboard/F347ShiftReassignment/0"
                    )
                  }
                >
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              Employees Shift Assignment Report
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
          <R347ShiftReassignmentViewTableComponent
            rows={this.state.employeePayrollsData}
            columns={columns}
            showFilter={this.state.showTableFilter}
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
export default withRouter(R347ShiftAssignmentView);
